<template>
  <div id="app">
    <nav class="navbar navbar-fixed-top navbar-inverse">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <router-link :to="{path:'/'}" id="logo" class="navbar-brand">艾森豪魔術方塊</router-link>
        </div>
        <div id="navbar" class="navbar-collapse collapse" aria-expanded="true">
          <ul class="nav navbar-nav navbar-right">
            <li v-on:click="onSignIn" v-if="!user"><a>Login</a></li>
            <li v-if="user"><a><img v-bind:src="user.photoURL" style="height: 28px; width: 28px;">{{user.displayName}}</a></li>
            <li v-on:click="onSignOut" v-if="user"><a>Logout</a></li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="fluid container">
      <router-view :user="user" :firebasedb="firebasedb"></router-view>
    </div>
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
      noteList: {},
      firebasedb: firebaseApp.database()
    }
  },
  data: function () {
    return {
      firebase: firebaseApp,
      firebasedb: firebaseApp.database(),
      user: null,
      noteList: {}
    }
  },
  beforeCreate: function () {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        this.user = user
        this.firebasedb.ref('noteList/').child(user.uid).once('value')
          .then((dataSnapshot) => {
            this.noteList = dataSnapshot.val()

            if (!this.noteList) {
              this.noteList = {}
            }
            console.log(this.noteList)
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
  color: #2c3e50;
  margin-top: 60px;
}


.user {
  font-size: 2rem;
  float: right;
}


#logo {
  float: left;
  margin-right: 10px;
  font-size: 1.7em;
  color: white;
  text-transform: uppercase;
  font-weight: bold;
  
}

.nav {
  color: white;
}
</style>
