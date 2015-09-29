Schema = {};

Schema.Review = new SimpleSchema({
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
    user_name : {
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

Reviews.attachSchema(Schema.Review);