
var exiv = require('exiv2node')
  , fs = require('fs')
  , should = require('should')
  , dir = __dirname + '/images';

describe('exiv2', function(){
  describe('.getImageTags()', function(){
    it("should callback with image's tags", function(done) {
      exiv.getImageTags(dir + '/books.jpg', function(err, tags) {
        should.not.exist(err);
        tags.should.be.a('object');
        tags.should.have.property('Exif.Image.DateTime', '2008:12:16 21:28:36');
        tags.should.have.property('Exif.Photo.DateTimeOriginal', '2008:12:16 21:28:36');
        done();
      })
    });

    it('should callback with null on untagged file', function(done) {
      exiv.getImageTags(dir + '/damien.jpg', function(err, tags) {
        should.not.exist(err);
        should.not.exist(tags);
        done();
      })
    });

    it('should throw if no file path is provided', function() {
      (function(){
        exiv.getImageTags()
      }).should.throw();
    });

    it('should throw if no callback is provided', function() {
      (function(){
        exiv.getImageTags(dir + '/books.jpg')
      }).should.throw();
    });

    it('should report an error on an invalid path', function(done) {
      exiv.getImageTags('idontexist.jpg', function(err, tags) {
        should.exist(err);
        should.not.exist(tags);
        done();
      });
    });
  });

  describe('.setImageTags()', function(){
    var temp = dir + '/copy.jpg';

    before(function() {
      fs.writeFileSync(temp, fs.readFileSync(dir + '/books.jpg'));
    });
    it('should write tags to image files', function(done) {
      var tags = {
        "Exif.Photo.UserComment" : "Some books..",
        "Exif.Canon.OwnerName" : "Damo's camera"
      };
      exiv.setImageTags(temp, tags, function(err){
        should.not.exist(err);

        exiv.getImageTags(temp, function(err, tags) {
          tags.should.have.property('Exif.Photo.UserComment', "Some books..");
          tags.should.have.property('Exif.Canon.OwnerName', "Damo's camera");
          done();
        });
      });
    })
    after(function(done) {
      fs.unlink(temp, done);
    });

    it('should throw if no file path is provided', function() {
      (function(){
        exiv.setImageTags()
      }).should.throw();
    });

    it('should throw if no callback is provided', function() {
      (function(){
        exiv.setImageTags(dir + '/books.jpg')
      }).should.throw();
    });

    it('should report an error on an invalid path', function(done) {
      exiv.setImageTags('idontexist.jpg', {}, function(err, tags) {
        should.exist(err);
        should.not.exist(tags);
        done();
      });
    });
  });
})
