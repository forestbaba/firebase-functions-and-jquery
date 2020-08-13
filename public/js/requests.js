var app2 = new Vue({
    el: '#app',
    data: {
        requests: []
    },
    methods: {
        
        upvoteRequest(id) {
            console.log(id);
            const upvote = firebase.functions().httpsCallable('upvote');

            upvote({id})
                .catch(err => {
                showNotification(err.message)
            })
        }
    },
    mounted() {
        const ref = firebase.firestore().collection('requests').orderBy('upvotes', 'desc');
        ref.onSnapshot(snapshot => {

            let request = []
            snapshot.forEach(doc => {
                request.push({ ...doc.data(), id: doc.id })
            })

           this.requests = request
        })
    }
})


