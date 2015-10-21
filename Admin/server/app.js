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
Images.allow({
    insert: function (userId) {
        return (userId ? true : false);
    },
    remove: function (userId) {
        return (userId ? true : false);
    },
    download: function () {
        return true;
    },
    update: function (userId) {
        return (userId ? true : false);
    }
});
Meteor.publish('images', function() {
    return Images.find({});
});

Meteor.methods({
    /**
     * Wines CRUD
     */
    createWine: function( wine ) {
        if ( !Meteor.userId() ) {
          throw new Meteor.Error('not-authorized');
        }
        Wines.insert( wine );
    },
    updateWine: function( wine, oldImageId ) {
        if ( !Meteor.userId() ) {
          throw new Meteor.Error('not-authorized');
        }
        Wines.update( wine._id, wine );
        if ( oldImageId ) {
          Images.remove( oldImageId );
        }
    },
    deleteWine: function ( wine_id ) {
        if ( !Meteor.userId() ) {
          throw new Meteor.Error( 'not-authorized' );
        }
        Wines.remove( wine_id );
        Specials.remove( { wine_id: wine_id } );
    },


    /**
     * Specials CRUD
     */
    createSpecial: function( special ) {
        if ( !Meteor.userId() ) {
          throw new Meteor.Error('not-authorized');
        }
        Specials.insert( special );
    },
    updateSpecial: function( special ) {
        if ( !Meteor.userId() ) {
          throw new Meteor.Error('not-authorized');
        }
        Specials.update( special._id, special );
    },
    deleteSpecial: function( special_id ) {
        if ( !Meteor.userId() ) {
          throw new Meteor.Error('not-authorized');
        }
        Specials.remove( special_id );
    },


    /**
     * Wineries CRUD
     */
    createWinery: function( winery ) {
        if ( !Meteor.userId() ) {
          throw new Meteor.Error('not-authorized');
        }
        Wineries.insert( winery );
    },
    updateWinery: function( winery, oldImageId ) {
        if ( !Meteor.userId() ) {
          throw new Meteor.Error('not-authorized');
        }
        Wineries.update( winery._id, winery );
        if (oldImageId) {
          Images.remove(oldImageId);
        }
    },

    /**
     * Wine Clubs CRUD
     */
    createWineClub: function( wine_club ) {
        if ( !Meteor.userId() ) {
          throw new Meteor.Error('not-authorized');
        }
        WineClubs.insert( wine_club );
    },
    updateWineClub: function( wine_club ) {
        if ( !Meteor.userId() ) {
          throw new Meteor.Error('not-authorized');
        }
        WineClubs.update( wine_club._id, wine_club );
    },
    deleteWineClub: function( wine_club_id ) {
        if ( !Meteor.userId() ) {
          throw new Meteor.Error('not-authorized');
        }
        WineClubs.remove( wine_club_id );
    }
});