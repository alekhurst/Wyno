Schema = {};

Schema.Note = new SimpleSchema({
    created_at: {
        type: String
    },
    updated_at: {
        type: String,
        optional: true
    },
    user_id: {
        type: String
    },
    wine_id: {
        type: String
    },
    text: {
        type: String,
        min: 20,
        max: 300
    },
    stars: {
        type: Number,
        min: 1,
        max: 5
    }
});

Notes.attachSchema(Schema.Note);