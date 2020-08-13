const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

//auth trigger ( new user signup)

exports.newUserSignup = functions.auth.user().onCreate((user) => {

    return admin.firestore().collection('users').doc(user.uid).set({
        email: user.email,
        upvotedOn: []
    })

})

//User deleted
exports.userDeleted = functions.auth.user().onDelete((user) => {
    const doc = admin.firestore().collection('users').doc(user.uid)
    return doc.delete();
})

//http callable function
exports.addRequest = functions.https.onCall((data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'only authenticated users can add request'
        );
    }
    if (data.text.length > 30) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'request must be not more than 30 characters long'
        );
    }

    return admin.firestore().collection('requests').add({
        text: data.text,
        upvotes: 0,
    });
})


//upvote callable function
exports.upvote = functions.https.onCall(async (data, context) => {

    //check auth state
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'only authenticated users can add request'
        );
    }

    //get refs for user doc and request doc
    const user = admin.firestore().collection('users').doc(context.auth.uid)
    const request = admin.firestore().collection('requests').doc(data.id)

    const doc = await user.get()

    //check user has not voted the request
    if (doc.data().upvotedOn.includes(data.id)) {
        throw new functions.https.HttpsError(
            'failed-precondition',
            'You can only vote once'
        )
    }

    //update user array
    await user.update({
        upvotedOn: [...doc.data().upvotedOn, data.id]
    })
    //update vote on request
    return request.update({
        upvotes: admin.firestore.FieldValue.increment(1)
    })
})

//Fire store trigger for an activity

exports.logActivity = functions.firestore.document('/{collection}/{id}')
    .onCreate((snap, context) => {

        const collection = context.params.collection;
        const id = context.params.id;

        const activities = admin.firestore().collection('activities');

        if (collection === 'requests') {
            return activities.add({ text: 'a new tutorial request was added' })
        }
        if (collection === 'users') {
            return activities.add({ text: 'a new user signed up' })
        }

        return null;
    })