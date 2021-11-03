const notificationAtStart = {
  content: null,
  type: null
}

const initialState = notificationAtStart

var timeoutID = null

export const setNotification = (content, style='success', time=5) => {
  return async dispatch => {
    dispatch ({
      type: 'SET_NOTIFICATION',
      data: {
        content: content,
        style: style
      }
    })
    clearTimeout(timeoutID)
    timeoutID = setTimeout(() => {
      dispatch ({
        type: 'REMOVE_NOTIFICATION'
      })
    }, time*1000)
  }
}

export const removeNotification = () => {
  return {
    type: 'REMOVE_NOTIFICATION'
  }
}

const notificationReducer = (state = initialState, action) => {
  let changedNotification = {
    content: null,
    style: null
  }
  switch (action.type) {

  case 'SET_NOTIFICATION':
    changedNotification.content = action.data.content
    changedNotification.style = action.data.style
    return changedNotification

  case 'REMOVE_NOTIFICATION':
    return changedNotification

  default: return state
  }
}

export default notificationReducer