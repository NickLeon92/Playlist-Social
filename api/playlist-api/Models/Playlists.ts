import mongoose from 'mongoose'

const { Schema } = mongoose;

const playlistSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    author:{
        type: String,
        ref: "User"        
    },
    songs: [
        {
            id: String,
            song: String,
            artists: String,
            album: String,
            image: String,
            added: Boolean,
            songId: String
        }
    ]
});

const Playlist = mongoose.model('Playlist', playlistSchema);

export default Playlist