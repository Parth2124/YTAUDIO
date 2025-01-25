const express = require('express');
const bodyParser = require('body-parser');
const youtubedl = require('youtube-dl-exec');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve HTML and static files

// Route for downloading audio
app.post('/download', async (req, res) => {
    const videoUrl = req.body.url;

    if (!videoUrl) {
        return res.status(400).send('YouTube URL is required.');
    }

    try {
        const outputPath = path.join(__dirname, 'downloads', 'audio.mp3');

        await youtubedl(videoUrl, {
            output: outputPath,
            format: 'bestaudio',
            extractAudio: true,
            audioFormat: 'mp3',
            ffmpegLocation: 'C:/ffmpeg-7.1-essentials_build/bin/ffmpeg.exe', // Path to ffmpeg executable
        });

        console.log('Download Done');
        res.download(outputPath, 'YourAudio.mp3'); 
    } catch (err) {
        console.error('Error while downloading:', err.message);
        res.status(500).send('Error while downloading: ' + err.message);
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
