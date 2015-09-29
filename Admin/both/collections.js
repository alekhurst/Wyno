Wines = new Mongo.Collection( "wines" );
WineClubs = new Mongo.Collection( "wine_clubs" );
Wineries = new Mongo.Collection( "wineries" );
Specials = new Mongo.Collection( "specials" );
Images = new FS.Collection("images", {
  stores: [
    new FS.Store.GridFS("original"),
    new FS.Store.GridFS("thumbnail", {
      transformWrite: function(fileObj, readStream, writeStream) {
        gm(readStream, fileObj.name()).resize('180').stream().pipe(writeStream);
      }
    })
  ],
  filter: {
    allow: {
      contentTypes: ['image/*']
    }
  }
});
