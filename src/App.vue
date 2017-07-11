

<template>
  <div class="fluid container" id="app">
    <div class="form-group form-group-lg panel panel-default">
      <div class="panel-heading">
        <h3 class="panel-title">Sortbale control</h3>
      </div>
      <div class="panel-body">
        <div class="btn btn-default" v-on:click="onSignIn" v-if="!user" >Login</div>
        <div class="user" v-on:click="onSignIn" v-if="user">Hello <img v-bind:src="user.photoURL" style="height: 32px; width: 32px;">{{user.displayName}}</div>
        <div class="btn btn-default" v-on:click="onSignOut" v-if="user">Logout</div>
      </div>
    </div>
    <router-view :user="user" :noteList="noteList"></router-view>
  </div>
</template>

<script>

import firebase from 'firebase'

var firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyDUrmO0CmQhXe74I7txd8jDmwHAMszxCPA',
  authDomain: 'eisenhower-fed8a.firebaseapp.com',
  databaseURL: 'https://eisenhower-fed8a.firebaseio.com'
})
var googleLoginProvider = new firebase.auth.GoogleAuthProvider()

export default {
  name: 'app',
  firebase: function () {
    return {
      user: null,
      noteList: []
    }
  },
  data: function () {
    return {
      firebase: firebaseApp,
      firebasedb: firebaseApp.database(),
      user: null,
      noteList: []
    }
  },
  beforeCreate: function () {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        this.user = user
        this.firebasedb.ref('noteList/').child(user.uid).once('value')
          .then((dataSnapshot) => {
            this.noteList = dataSnapshot.val()
          })
      } else {
        this.user = null
      }
    }.bind(this))
  },
  methods: {
    onSignIn () {
      firebase.auth().signInWithPopup(googleLoginProvider)
    },
    onSignOut () {
      firebase.auth().signOut()
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}


.user {
  font-size: 2rem;
  float: right;
}
</style>
