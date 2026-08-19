# Same Side setup guide

The site already works as a plain static site. Follow these steps when you are ready to connect Firebase so the contact form saves enquiries and the dev editing mode works. Everything here happens in the Firebase console at https://console.firebase.google.com and in one file in this repo.

## 1. Create the Firebase project

1. Go to https://console.firebase.google.com and sign in with a Google account.
2. Click Add project (or Create a project).
3. Name it something like same-side. You can turn Google Analytics off, the site has its own GA4 snippet.
4. Wait for the project to finish creating, then open it.

## 2. Register the web app and get the config

1. On the project overview page, click the web icon (the `</>` symbol) to add a web app.
2. Nickname it same-side-site. Do not tick Firebase Hosting, the site lives on GitHub Pages.
3. Firebase shows you a `firebaseConfig` object with apiKey, authDomain, projectId, storageBucket, messagingSenderId and appId.
4. Keep that tab open, you will paste these values in step 6.

## 3. Enable email and password sign in

1. In the left menu open Build, then Authentication.
2. Click Get started.
3. On the Sign-in method tab choose Email/Password, turn on the first toggle (Email/Password) and save. Leave the passwordless email link option off.

## 4. Create your admin user

There is no public sign up on the site on purpose, so the account is made here.

1. Still in Authentication, open the Users tab.
2. Click Add user.
3. Enter the email and a strong password you want to use as the site editor login.
4. Click Add user. This is the login the dev button will accept.

## 5. Create the Firestore database and paste in the rules

1. In the left menu open Build, then Firestore Database.
2. Click Create database. Choose production mode. Pick a nearby location such as australia-southeast1 and confirm. The location cannot be changed later.
3. Once the database exists, open the Rules tab.
4. Delete everything in the editor and paste in the full contents of the `firestore.rules` file from this repo.
5. Click Publish.

These rules let anyone read site content and create an enquiry, while only your signed in admin account can write content or read enquiries.

## 6. Fill in the config in app.js

1. Open `app.js` in this repo.
2. Near the top there is a `firebaseConfig` object where every value starts with `PASTE_`.
3. Replace each placeholder with the matching value from step 2. Keep the quotes.
4. Commit and push the change (or edit the file directly on GitHub). Once the apiKey and projectId no longer start with `PASTE_`, the site connects automatically on the next load.

## 7. Add the GitHub Pages domain to authorized domains

Firebase Auth only accepts logins from domains it trusts.

1. In Authentication open the Settings tab, then Authorized domains.
2. Click Add domain and enter mnny123.github.io
3. Save. localhost is already on the list, which is handy for local testing.

## 8. Test the dev button

1. Open https://mnny123.github.io/sameside/ in a normal browser window.
2. Scroll to the footer and click the small low contrast word dev on the right.
3. Log in with the email and password from step 4.
4. Every body text block gets a dashed outline and becomes editable in place. An Editing mode bar appears in the corner.
5. Change some text, click Save changes and wait for the Saved confirmation.
6. Open the site in a private window (not logged in). Your edited text should show instead of the default, because the site loads saved text from Firestore for all visitors.
7. Back in the logged in window, click Log out. The outlines disappear.

If an edit ever goes wrong, delete the matching document from the `content` collection in Firestore and the site falls back to the default text baked into `app.js`.

## 9. Test the contact form

1. With the config filled in, submit a test enquiry through the contact page.
2. You should land on the thank you page.
3. In Firestore, check the `enquiries` collection for a new document with the name, school, role and message fields.

## Extra placeholders to fill in later

- The GA4 snippet in `index.html` uses G-XXXXXXXXXX twice, marked [Placeholder: add GA4 ID]. Replace both with your real measurement ID from Google Analytics.
- Social share images point to `share-image.png` at the repo root. Upload a 1200 x 630 image with that name when you have one.
- The case studies and reviews are marked as placeholders on the site. Replace them with real pilot results through the dev editing mode once you have them.
