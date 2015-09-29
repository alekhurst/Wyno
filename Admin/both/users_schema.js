Schema = {};

Schema.UserProfile = new SimpleSchema({
    first_name: {
        type: String,
        regEx: /^[a-zA-Z-]{2,25}$/
    },
    last_name: {
        type: String,
        regEx: /^[a-zA-Z]{2,25}$/
    },
    winery_id: {
        type: String
    },
    role: {
        type: String
    }
});

Schema.User = new SimpleSchema({
    emails: {
        type: [Object]
    },
    "emails.$.address": {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        custom: function() {
            var email_domain = this.value.split( "@" )[1];
            switch( email_domain ) {
                case "truetthurst.com":
                    return true;
                case "vml.com":
                    return true;
                default:
                    return "INVALIDEMAIL";
            }
        }
    },
    "emails.$.verified": {
        type: Boolean
    },
    createdAt: {
        type: Date
    },
    profile: {
        type: Schema.UserProfile
    },
    services: {
        type: Object,
        blackbox: true
    },
});

Meteor.users.attachSchema(Schema.User);