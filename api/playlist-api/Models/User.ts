import mongoose from 'mongoose'

const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    token_data : {
        type: Object
    },
    playlists: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Playlist'
        }
    ]
});

const User = mongoose.model('User', userSchema);

export default User