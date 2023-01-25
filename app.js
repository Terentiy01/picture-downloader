import { upload } from './upload'
import { initializeApp } from 'firebase/app'
import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyBJnyHsoOaZm64apbsHKhk0dGnZY6PUk_Q',
  authDomain: 'downloader-a2a9a.firebaseapp.com',
  projectId: 'downloader-a2a9a',
  storageBucket: 'downloader-a2a9a.appspot.com',
  messagingSenderId: '599199455549',
  appId: '1:599199455549:web:5d2635bb130517e6eecd54',
}

const app = initializeApp(firebaseConfig)

upload('#file', {
  multi: true,
  accept: ['.png', '.jpg', '.jpeg', '.gif'],
  loading(smth, blocks) {
    smth.forEach((f, index) => {
      const storage = getStorage()
      const storageRef = ref(storage, `images/${f.name}`)

      const uploadTask = uploadBytesResumable(storageRef, f)

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (
            (snapshot.bytesTransferred / snapshot.totalBytes) *
            100
          ).toFixed(0)
          const block = blocks[index].querySelector('.preview-info-progress')
          block.textContent = progress
          block.style.width = progress + '%'
          console.log('Upload is ' + progress + '% done')
        },
        (error) => {
          console.log(error)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            console.log('File available at', url)
          })
        }
      )
    })
  },
})
