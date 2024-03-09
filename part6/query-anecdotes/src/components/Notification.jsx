import { useNotificationValue } from "../NotificationContextHooks"

const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }
  
  const text = useNotificationValue()

  if (text === '') return <div></div>

  return (
    <div style={style}>
      {text}
    </div>
  )
}

export default Notification
