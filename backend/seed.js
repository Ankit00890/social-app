const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Post = require('./models/Post');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const users = [
    {
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        password: 'password123',
        isAdmin: false,
        profilePic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80',
    },
    {
        name: 'James Bond',
        email: 'james@example.com',
        password: 'password123',
        isAdmin: false,
        profilePic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80',
    },
    {
        name: 'Emily blunt',
        email: 'emily@example.com',
        password: 'password123',
        isAdmin: false,
        profilePic: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80',
    },
];

const posts = [
    {
        content: 'Just arrived in Paris! The view from the hotel is amazing. 🇫🇷✨',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
    },
    {
        content: 'Working on my new project. Coffee is essential! ☕️💻',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
    },
    {
        content: 'Beautiful sunset at the beach today. 🌅🌊',
        image: 'https://images.unsplash.com/photo-1471922694835-d878781bf999?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
    },
    {
        content: 'Hiking trip with friends! The mountains are calling. 🏔️🥾',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
    },
    {
        content: 'Delicious healthy lunch. 🥗🥑',
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
    },
    {
        content: 'My new puppy! verify cute 🐶❤️',
        image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
    },
];

const importData = async () => {
    try {
        await Post.deleteMany();
        await User.deleteMany();

        const createdUsers = await User.insertMany(users);
        const adminUser = createdUsers[0]._id;

        const samplePosts = posts.map((post) => {
            // Assign random user to each post
            const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
            return { ...post, user: randomUser._id };
        });

        await Post.insertMany(samplePosts);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
