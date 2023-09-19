import {
  upload,
  storageQuery,
  storageList,
  storageCreate,
  storageModify,
  storageInfo,
  storageRemove
} from '@/api/comm'

const actions = {
  upload({ commit }, json) {
    return new Promise((resolve, reject) => {
      upload(json).then(response => {
        const data = response

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  storageQuery({ commit }, json) {
    return new Promise((resolve, reject) => {
      storageQuery(json).then(response => {
        const data = response

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  storageList({ commit }, json) {
    return new Promise((resolve, reject) => {
      storageList(json).then(response => {
        const data = response

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  storageCreate({ commit }, json) {
    return new Promise((resolve, reject) => {
      storageCreate(json).then(response => {
        const data = response

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  storageModify({ commit }, json) {
    return new Promise((resolve, reject) => {
      storageModify(json).then(response => {
        const data = response

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  storageInfo({ commit }, json) {
    return new Promise((resolve, reject) => {
      storageInfo(json).then(response => {
        const data = response

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  storageRemove({ commit }, json) {
    return new Promise((resolve, reject) => {
      storageRemove(json).then(response => {
        const data = response

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
}

export default {
  namespaced: true,
  actions
}
