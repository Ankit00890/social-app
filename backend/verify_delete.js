const http = require('http');

async function runTests() {
    const baseUrl = 'http://localhost:5000/api';
    let token = '';
    let userId = '';
    let postId = '';
    const timestamp = Date.now();
    const testEmail = `testuser_del_${timestamp}@example.com`;

    const request = (method, path, body = null, authToken = null) => {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: 'localhost',
                port: 5000,
                path: `/api${path}`,
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            if (authToken) {
                options.headers['Authorization'] = `Bearer ${authToken}`;
            }

            const req = http.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    try {
                        const parsed = data ? JSON.parse(data) : {};
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

    console.log('--- Starting Delete Verification ---');

    // 1. Register User
    console.log(`\n1. Registering user: ${testEmail}...`);
    const regRes = await request('POST', '/auth/register', {
        name: 'Delete Test User',
        email: testEmail,
        password: 'password123',
    });
    if (regRes.status === 201) {
        console.log('✅ User registered successfully');
        token = regRes.data.token;
        userId = regRes.data._id;
    } else {
        console.error('❌ Registration failed:', regRes.data);
        return;
    }

    // 2. Create Post
    console.log('\n2. Creating Post...');
    const postRes = await request('POST', '/posts', {
        content: 'This is a test post for deletion',
    }, token);
    if (postRes.status === 201) {
        console.log('✅ Post created successfully');
        postId = postRes.data._id;
    } else {
        console.error('❌ Post creation failed:', postRes.data);
        return;
    }

    // 3. Delete Post
    console.log('\n3. Deleting Post...');
    const delPostRes = await request('DELETE', `/posts/${postId}`, {}, token);
    if (delPostRes.status === 200) {
        console.log('✅ Post deleted successfully');
    } else {
        console.error(`❌ Post deletion failed: Status ${delPostRes.status}`, delPostRes.data);
    }

    console.log('\n--- Verification Complete ---');
}

runTests().catch(err => console.error(err));
