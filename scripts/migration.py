import pyrebase

config = {
    "apiKey": "AIzaSyDaFephL3mkBV4AD2mQW6XBbZ9UXoTumHE",
    "authDomain": "tafta-pllc.firebaseapp.com",
    "databaseURL": "https://tafta-pllc.firebaseio.com",
    "projectId": "tafta-pllc",
    "storageBucket": "tafta-pllc.appspot.com",
    "messagingSenderId": "704054740108"
}
firebase = pyrebase.initialize_app(config)
auth = firebase.auth()
user = auth.sign_in_with_email_and_password("user@example.ca", "Password12")
token = user['idToken']
db = firebase.database()

ref = db.child('comments/participation')
data = ref.get(token).val()

for key, value in data.items():
    db.child(f"comments/academic/{key}").set(value, token=token)