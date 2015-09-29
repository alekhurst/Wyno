Meteor.publish( 'wines', function () {
    return Wines.find();
});
Meteor.publish( 'wine_clubs', function () {
    return WineClubs.find();
});
Meteor.publish( 'wineries', function () {
    return Wineries.find();
});
Meteor.publish( 'specials', function () {
    return Specials.find();
});
Meteor.publish( 'notes', function() {
	return Notes.find();
});
Meteor.publish( 'reviews', function() {
	return Reviews.find();
});
Images.allow({
    download: function () {
        return true;
    }
});
Meteor.publish('images', function() {
    return Images.find({});
});

Meteor.methods({
    /**
     * Notes CRUD
     */
	createNote: function( new_note ) {
		if ( !Meteor.userId() ) {
          	throw new Meteor.Error('not-authorized');
        }
        Notes.insert( new_note );
	},
	updateNote: function( updated_note ) {
		if ( !Meteor.userId() ) {
          	throw new Meteor.Error('not-authorized');
        }
        Notes.update( updated_note._id, {
        	$set: { 
        		updated_at: updated_note.updated_at,
        		text: updated_note.text,
        		stars: updated_note.stars,
        	}
        });
	},

    /**
     * Reviews CRUD
     */
	createReview: function( new_review ) {
        // check for user and insert
        if ( !Meteor.userId() ) {
            throw new Meteor.Error('not-authorized');
        }
        Reviews.insert( new_review );
        Meteor.call( 'refreshWineReviewData', new_review.wine_id );
	},
    updateReview: function( updated_review ) {
        if ( !Meteor.userId() ) {
            throw new Meteor.Error('not-authorized');
        }
        Reviews.update( updated_review._id, {
            $set: { 
                updated_at: updated_review.updated_at,
                text: updated_review.text,
                stars: updated_review.stars,
            }
        });
        Meteor.call( 'refreshWineReviewData', updated_review.wine_id );
    },
    refreshWineReviewData: function( wine_id ) {
        var reviews = Reviews.find( { wine_id: wine_id } );
        var total_reviews = reviews.count();
        var total_rating = 0;
        var averate_rating;

        reviews.forEach( function( review ) {
            total_rating += review.stars;
        })

        average_rating = total_rating / total_reviews;

        Wines.update( wine_id, {
            $set: {
                "reviews.avg_rating": average_rating,
                "reviews.count": total_reviews
            }
        })
    }
})


