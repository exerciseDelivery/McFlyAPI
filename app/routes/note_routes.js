var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {

    // Get a note
    app.get('/note/:id', (req, res) => {
        const id = req.params.id;

        if(id) {
            const details = { '_id': new ObjectID(id) };
        
            db.collection('notes').findOne(details, (err, item) => {
                if (err) {
                    res.send({'error':'An error has occurred'});
                } else {
                    res.send(item);
                }
            });
        } else {
            res.send({'error':'An error has occurred'});
        }
    });

    // Delete a note
    app.delete('/note/:id', (req, res) => {
        const id = req.params.id;
        if(id) {
            const details = { '_id': new ObjectID(id) };
            db.collection('notes').remove(details, (err, item) => {
                if (err) {
                    res.send({'error':'An error has occurred'});
                } else {
                    res.send({'success': 'Note ' + id + ' deleted!'});
                } 
            });
        } else {
            res.send({'error':'An error has occurred'});
        }
    });

    // Favorite a note
    app.patch('/note/:id', (req, res) => {
        const id = req.params.id;
        if(id) {
            const details = { '_id': new ObjectID(id) };
            const fav  = { $set: { fav: true } };
            db.collection('notes').updateOne(details, fav, (err, result) => {
                if (err) {
                    res.send({'error':'An error has occurred'});
                } else {
                    res.send(result);
                } 
            });
        } else {
            res.send({'error':'An error has occurred'});
        }
    });

    // Create new note
    app.post('/note', (req, res) => {
        if(req.body.body) {
            const note = { body: req.body.body, fav: false };
            db.collection('notes').insert(note, (err, result) => {
                if (err) { 
                    res.send({ 'error': 'An error has occurred' }); 
                } else {
                    res.send(result.ops[0]);
                }
            });
        } else {
            res.send({ 'error': 'An error has occurred' });
        }
        
    });

    // Get all notes
    app.get('/notes', (req, res) => {
        db.collection('notes').find({}).toArray(function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send(result);
            }
        });
    });

    // Get all favorited notes
    app.get('/favnotes', (req, res) => {
        const query = { fav: true };
        db.collection('notes').find(query).toArray(function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send(result);
            }
        });
    });

};
