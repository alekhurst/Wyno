Wines = new Mongo.Collection( "wines" );
WineClubs = new Mongo.Collection( "wine_clubs" );
Wineries = new Mongo.Collection( "wineries" );
Specials = new Mongo.Collection( "specials" );
Reviews = new Mongo.Collection( "reviews" );
Notes = new Mongo.Collection( "notes" );
Users = new Mongo.Collection( "restricted_user_data" );
Images = new FS.Collection("images", {
  stores: [
    new FS.Store.GridFS("original"),
    new FS.Store.GridFS("thumbnail", {
      transformWrite: function(fileObj, readStream, writeStream) {
        gm(readStream, fileObj.name()).resize('180', '180', '!').stream().pipe(writeStream);
      }
    })
  ],
  filter: {
    allow: {
      contentTypes: ['image/*']
    }
  }
});