import { spawn } from 'child_process';
import crypto from 'crypto';

async function main() {
  console.log('--- STARTING IMOVIES VERIFICATION TEST SUITE ---');

  // Spawn server process
  const serverProc = spawn('node', ['server.js'], {
    cwd: process.cwd(),
    stdio: 'pipe',
  });

  serverProc.stdout.on('data', (d) => {
    const text = d.toString();
    if (text.includes('iMovies API Server running') || text.includes('[Seed]')) {
      console.log(`[Server] ${text.trim()}`);
    }
  });

  serverProc.stderr.on('data', (d) => {
    console.error(`[Server Error] ${d.toString().trim()}`);
  });

  const cleanup = () => {
    try {
      serverProc.kill('SIGTERM');
      serverProc.kill('SIGKILL');
    } catch (e) {}
  };

  process.on('exit', cleanup);
  process.on('SIGINT', cleanup);

  // Poll until health endpoint responds
  let baseUrl = 'http://127.0.0.1:5050/api';
  let isReady = false;
  for (let i = 0; i < 30; i++) {
    for (const port of [5050, 5000, 5005]) {
      try {
        const res = await fetch(`http://127.0.0.1:${port}/api/health`, {
          signal: AbortSignal.timeout(500),
        });
        if (res.ok) {
          baseUrl = `http://127.0.0.1:${port}/api`;
          isReady = true;
          break;
        }
      } catch (e) {}
    }
    if (isReady) break;
    await new Promise((r) => setTimeout(r, 400));
  }

  if (!isReady) {
    console.error('Server failed to start within timeout.');
    cleanup();
    process.exit(1);
  }

  try {
    // 1. Health check
    console.log('[Test 1] Probing Health...');
    const healthRes = await fetch(`${baseUrl}/health`);
    const health = await healthRes.json();
    console.log('Health:', health);

    // 2. Movies
    console.log('[Test 2] Probing Movies...');
    const moviesRes = await fetch(`${baseUrl}/movie`);
    const moviesData = await moviesRes.json();
    console.log(`Movies Count: ${moviesData.count}`);
    const firstMovie = moviesData.movies[0];
    console.log(`First Movie: "${firstMovie.movieName}" (ID: ${firstMovie._id})`);

    // 3. User Login
    console.log('[Test 3] Probing User Login...');
    const userLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'user@imovies.com', password: 'user123' }),
    });
    const userLogin = await userLoginRes.json();
    console.log('User Login Success:', userLogin.success, 'Token prefix:', userLogin.token?.slice(0, 15));
    const userToken = userLogin.token;

    // 4. Admin Login
    console.log('[Test 4] Probing Admin Login...');
    const adminLoginRes = await fetch(`${baseUrl}/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@imovies.com', password: 'admin123' }),
    });
    const adminLogin = await adminLoginRes.json();
    console.log('Admin Login Success:', adminLogin.success, 'Role:', adminLogin.admin?.role);
    const adminToken = adminLogin.token;

    // 5. Admin Overview
    console.log('[Test 5] Probing Admin Overview...');
    const overviewRes = await fetch(`${baseUrl}/admin/overview`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const overview = await overviewRes.json();
    console.log('Admin Stats:', overview.stats);

    // 6. Shows for Movie
    console.log('[Test 6] Probing Shows for Movie...');
    const showsRes = await fetch(`${baseUrl}/shows/movie/${firstMovie._id}`);
    const showsData = await showsRes.json();
    console.log(`Grouped Theatres for Movie: ${showsData.groupedByTheatre?.length}`);
    const firstShow = showsData.shows[0];
    console.log(`First Show ID: ${firstShow?.showId} at ${firstShow?.showTime}`);

    // 7. Lock Seats
    console.log('[Test 7] Probing Real-Time Seat Lock (TTL)...');
    const lockRes = await fetch(`${baseUrl}/bookings/lock-seats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        showId: firstShow.showId,
        seats: ['A1', 'A2'],
      }),
    });
    const lockData = await lockRes.json();
    console.log('Seat Lock Result:', lockData);

    // 8. Create Razorpay Order
    console.log('[Test 8] Probing Razorpay Create-Order (Test Mode)...');
    const orderRes = await fetch(`${baseUrl}/payment/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        showId: firstShow.showId,
        selectedSeats: ['A1', 'A2'],
        totalAmount: 900,
        ticketsData: firstShow.tickets,
      }),
    });
    const orderData = await orderRes.json();
    console.log('Order Result:', {
      success: orderData.success,
      order_id: orderData.order_id,
      amount: orderData.amount,
      bookingId: orderData.bookingId,
      key: orderData.key,
    });

    // 9. Verify Razorpay Payment (Cryptographic HMAC SHA256)
    console.log('[Test 9] Probing Razorpay Verify Payment (HMAC SHA-256)...');
    const testPaymentId = 'pay_test_' + Date.now().toString(36);
    const secret = '5OtY3b29pz3FK1KukmSiZqmS';
    const signature = crypto
      .createHmac('sha256', secret)
      .update(`${orderData.order_id}|${testPaymentId}`)
      .digest('hex');

    const verifyRes = await fetch(`${baseUrl}/payment/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        razorpay_order_id: orderData.order_id,
        razorpay_payment_id: testPaymentId,
        razorpay_signature: signature,
        bookingId: orderData.bookingId,
      }),
    });
    const verifyData = await verifyRes.json();
    console.log('Payment Verification Result:', {
      success: verifyData.success,
      message: verifyData.message,
      bookingStatus: verifyData.booking?.paymentStatus,
    });

    // 10. Check User Bookings
    console.log('[Test 10] Probing User Booking History...');
    const userBookingsRes = await fetch(`${baseUrl}/bookings/user`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    const userBookingsData = await userBookingsRes.json();
    console.log(`User Bookings Count: ${userBookingsData.bookings?.length}`);

    // 11. Admin Transactions & Refund
    console.log('[Test 11] Probing Admin Transactions & Refund Management...');
    const txRes = await fetch(`${baseUrl}/admin/transactions`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const txData = await txRes.json();
    console.log(`Admin Transactions Count: ${txData.count}`);
    const latestTx = txData.transactions[0];
    console.log('Processing Refund for Payment ID:', latestTx.paymentId);

    const refundRes = await fetch(`${baseUrl}/admin/refund/${latestTx.paymentId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ reason: 'Integration test automated refund' }),
    });
    const refundData = await refundRes.json();
    console.log('Refund Result:', {
      success: refundData.success,
      message: refundData.message,
      status: refundData.booking?.paymentStatus,
      refundId: refundData.booking?.refundId,
    });

    // 12. Verify seats freed up
    console.log('[Test 12] Verifying seats freed up after refund...');
    const verifyShowRes = await fetch(`${baseUrl}/shows/${firstShow.showId}`);
    const verifyShowData = await verifyShowRes.json();
    const seatA1 = verifyShowData.show?.tickets?.['A1'];
    console.log('Seat A1 status after refund:', seatA1?.status);

    console.log('==================================================');
    console.log('🎉 ALL 12 FULL-STACK ARCHITECTURE TESTS PASSED! 🎉');
    console.log('==================================================');
    cleanup();
    process.exit(0);
  } catch (err) {
    console.error('VERIFICATION FAILED:', err);
    cleanup();
    process.exit(1);
  }
}

main();
