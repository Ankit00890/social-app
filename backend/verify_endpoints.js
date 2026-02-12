const http = require('http');

async function runTests() {
    const baseUrl = 'http://localhost:5000/api';
    let token = '';
    let userId = '';
    let postId = '';
    let commentId = '';
    const timestamp = Date.now();
    const testEmail = `testuser${timestamp}@example.com`;

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

    console.log('--- Starting Backend Verification ---');

    // 1. Register User
    console.log(`\n1. Registering user: ${testEmail}...`);
    const regRes = await request('POST', '/auth/register', {
        name: 'Test User',
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

    // 2. Login (Already have token, but testing login endpoint)
    console.log('\n2. Testing Login...');
    const loginRes = await request('POST', '/auth/login', {
        email: testEmail,
        password: 'password123',
    });
    if (loginRes.status === 200) {
        console.log('✅ Login successful');
    } else {
        console.error('❌ Login failed:', loginRes.data);
    }

    // 3. Update Profile
    console.log('\n3. Testing Update Profile...');
    const updateRes = await request('PUT', '/auth/profile', {
        name: 'Updated Test User',
        password: 'newpassword123',
    }, token);
    if (updateRes.status === 200 && updateRes.data.name === 'Updated Test User') {
        console.log('✅ Profile updated successfully');
        if (updateRes.data.token) {
            token = updateRes.data.token;
            console.log('ℹ️ Token updated after profile change');
        }
    } else {
        console.error('❌ Profile update failed:', updateRes.data);
    }

    // 4. Create Post
    console.log('\n4. Creating Post...');
    const postRes = await request('POST', '/posts', {
        content: 'This is a test post',
    }, token);
    if (postRes.status === 201) {
        console.log('✅ Post created successfully');
        postId = postRes.data._id;
    } else {
        console.error('❌ Post creation failed:', postRes.data);
        return;
    }

    // 5. Like Post
    console.log('\n5. Liking Post...');
    const likeRes = await request('PUT', `/posts/${postId}/like`, {}, token);
    if (likeRes.status === 200 && Array.isArray(likeRes.data)) {
        console.log('✅ Post liked successfully');
    } else {
        console.error('❌ Post like failed:', likeRes.data);
    }

    // 6. Add Comment (using existing route)
    console.log('\n6. Adding Comment...');
    const commRes = await request('POST', `/posts/${postId}/comments`, {
        content: 'This is a test comment',
    }, token);
    if (commRes.status === 201) {
        console.log('✅ Comment added successfully');
        commentId = commRes.data._id;
    } else {
        console.error('❌ Comment addition failed:', commRes.data);
    }

    // 7. Delete Comment (New Feature)
    console.log('\n7. Deleting Comment...');
    const delCommRes = await request('DELETE', `/posts/${postId}/comments/${commentId}`, {}, token);
    if (delCommRes.status === 200) {
        console.log('✅ Comment deleted successfully');
    } else {
        console.error(`❌ Comment deletion failed: Status ${delCommRes.status}`, delCommRes.data);
    }

    // 8. Delete Post (New Feature)
    console.log('\n8. Deleting Post...');
    const delPostRes = await request('DELETE', `/posts/${postId}`, {}, token);
    if (delPostRes.status === 200) {
        console.log('✅ Post deleted successfully');
    } else {
        console.error(`❌ Post deletion failed: Status ${delPostRes.status}`, delPostRes.data);
    }

    console.log('\n--- Verification Complete ---');
}

runTests().catch(err => console.error(err));
