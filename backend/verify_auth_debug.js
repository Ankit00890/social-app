const http = require('http');

const request = (method, path, body) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: `/api/auth${path}`,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, data: data });
                }
            });
        });

        req.on('error', (e) => reject(e));

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
};

const runTests = async () => {
    console.log('--- Testing Auth Endpoints ---');
    const timestamp = Date.now();
    const email = `debug_user_${timestamp}@example.com`;
    const password = 'password123';

    // 1. Test Registration
    console.log(`\n1. Registering ${email}...`);
    try {
        const regRes = await request('POST', '/register', {
            name: 'Debug User',
            email,
            password,
        });
        console.log(`Status: ${regRes.status}`);
        if (regRes.status === 201) {
            console.log('✅ Registration SUCCESS');
            console.log('Token received:', regRes.data.token ? 'YES' : 'NO');
        } else {
            console.log('❌ Registration FAILED');
            console.log('Response:', regRes.data);
        }
    } catch (e) {
        console.error('Registration Exception:', e.message);
    }

    // 2. Test Login
    console.log(`\n2. Logging in...`);
    try {
        const loginRes = await request('POST', '/login', {
            email,
            password,
        });
        console.log(`Status: ${loginRes.status}`);
        if (loginRes.status === 200) {
            console.log('✅ Login SUCCESS');
            console.log('Token received:', loginRes.data.token ? 'YES' : 'NO');
        } else {
            console.log('❌ Login FAILED');
            console.log('Response:', loginRes.data);
        }
    } catch (e) {
        console.error('Login Exception:', e.message);
    }
};

runTests();
