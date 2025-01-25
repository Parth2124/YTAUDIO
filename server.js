const express = require('express');
const bodyParser = require('body-parser');
const youtubedl = require('youtube-dl-exec');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve HTML and static files
app.use('/downloads', express.static(path.join(__dirname, 'downloads'))); // Serve download folder

// Route for downloading audio
app.post('/download', async (req, res) => {
    const videoUrl = req.body.url;

    if (!videoUrl) {
        return res.status(400).send('YouTube URL is required.');
    }

    try {
        // Define the output path for the audio file
        const outputPath = path.join(__dirname, 'downloads', 'audio.mp3');

        // Make sure the 'downloads' folder exists
        if (!fs.existsSync(path.join(__dirname, 'downloads'))) {
            fs.mkdirSync(path.join(__dirname, 'downloads'));
        }

        // Download audio using youtube-dl
        await youtubedl(videoUrl, {
            output: outputPath,
            format: 'bestaudio',
            extractAudio: true,
            audioFormat: 'mp3',
            ffmpegLocation: process.env.FFMPEG_PATH || '/usr/local/bin/ffmpeg', // Make sure FFmpeg is installed
        });

        console.log('Download Done');
        res.download(outputPath, 'YourAudio.mp3');  // Trigger the download for the user
    } catch (err) {
        console.error('Error while downloading:', err.message);
        res.status(500).send('Error while downloading: ' + err.message);
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
