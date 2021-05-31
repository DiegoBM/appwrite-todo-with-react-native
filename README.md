# 🔖 Todo With React Native and Appwrite

A simple todo app built with Appwrite and React Native

🎉 Now with Social Login! Includes Github Sign In!

## 🎬 Getting Started

### 🤘 Install Appwrite

Follow Appwrite's simple [Installation Guide](https://appwrite.io/docs/installation) to get Appwrite up and running in no time. You can either deploy Appwrite on your local machine or, on any cloud provider of your choice.

> Note: If you setup Appwrite on your local machine, you will need to create a public IP so that your hosted frontend can access it.

You need to make a few configuration changes to your Appwrite server.

1. Add a new Web App in Appwrite and enter the endpoint of your website (`localhost, <project-name>.vercel.app etc`)
   ![Create Web App](https://user-images.githubusercontent.com/20852629/113019434-3c27c900-919f-11eb-997c-1da5a8303ceb.png)

2. Create a new collection with the following properties

- **Rules**

Add the following rules to the collection.

> Make sure that your key exactly matches the key in the images

<p align="center">
<img src="https://user-images.githubusercontent.com/20852629/113019972-c3753c80-919f-11eb-9b3a-c3690785bbf4.png" alt="Content Rule" width="400"/>
</p>

<p align="center">
<img src="https://user-images.githubusercontent.com/20852629/113020008-cec86800-919f-11eb-8cc2-473f8d15fc3f.png" alt="IsComplete Rule" width="400"/>
</p>

- **Permissions**

Add the following permissions to your collections. These permissions ensure that only registered users can access the collection.

<p align="center">
<img src="https://user-images.githubusercontent.com/20852629/113019801-99bc1580-919f-11eb-9a94-13b1529cb925.png" alt="Collection Permissions" width="400"/>
</p>

### 🚀 Configure and Run the Application

You will need to open the file `src\utils\sdk.ts`, and at the top, fill in these variables that will help your application connect to Appwrite.

- REACT_APP_ENDPOINT - Your Appwrite endpoint
- REACT_APP_PROJECT_ID - Your Appwrite project ID
- REACT_APP_COLLECTION_ID - Your Appwrite collection ID
- USE_GITHUB_SIGNIN - Include Github Sign In in the application

If you decide to include **Github Sign In** in your application, you will also need to configure the Github OAuth provider in your **Appwrite server**. You can use the following [article](https://dev.to/appwrite/30daysofappwrite-oauth-providers-3jf6) as a reference which shows how to configure Google OAuth provider, but it's similar to any other OAuth provider for Appwrite.

### **Run on your device (or simulator)**

Follow these instructions to run the application

```sh
$ git clone https://github.com/DiegoBM/appwrite-todo-with-react-native
$ cd appwrite-todo-with-react-native

```

Fill the following `src\utils\sdk.ts` variables:

```js
const REACT_APP_ENDPOINT = '';
const REACT_APP_PROJECT_ID = '';
const REACT_APP_COLLECTION_ID = '';
const USE_GITHUB_SIGNIN = true;
```

Now run the following commands and you should be good to go 💪🏼

```sh
$ npm install
```

For iOS devices you'll need to link the relevant CocoaPods. From the `/ios` directory run:

```sh
pod install
```

To run on Android:

```sh
$ npx react-native run-android
```

To run on iOS:

```sh
$ npx react-native run-ios
```

## 😧 Remarks

- Unfortunately, I could only test the application on Android devices, therefore it might look funny on iOS. If you find issues running the application on Apple devices and want to provide the style fixes to match the Android designs, (with the respective Platform instructions where necessary to respect the android implementation), I'll be happy to include the modifications in.

- This is a demo app that has been put together in one day, in order to make it for the [#30daysofappwrite](https://30days.appwrite.io/) event, so please fill your hearts with patience when browsing the code, since it's far from perfect. Beyond that, on top of all the features and look and feel that you can find in the official [todo-with-react](https://github.com/appwrite/todo-with-react), this react-native version includes some **extra additional features** such as the social login using [react-native-appwrite-oauth](https://github.com/DiegoBM/react-native-appwrite-oauth/), as well as cancellable requests for slow networks (more suitable for mobile devices) which can cause state updates after the component has been unmounted. Some other "slow network" implementations could have been taken into account such as blocking the interface over slow requests, or tracking request numbers in order to discard stale ones or server responses arriving in the wrong order, but it was probably too overkill for a small demo.
