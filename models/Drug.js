const mongoose = require('mongoose');

const DrugSchema = new mongoose.Schema({
    drugName: {
        type: String,
        required: true,
        trim: true
    },
    Manufacturer: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    usageCase: {
        type: String,
        required: true,
        default: "Malaria",
        enum: ['Malaria',
            'Cancer',
            'Typhoid',
            'HeartDisease',
            'LungDisease',
            'headache'
        ]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    jobRole: {
        type: String,
        default: 'admin',
        enum: ['admin', 'guest', 'agent']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('Drug', DrugSchema);