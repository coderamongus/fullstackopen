const Notification = ({ message, type }) => {
    if (!message) return null;
  
    const style = {
      padding: '10px',
      border: `2px solid ${type === 'error' ? 'red' : 'green'}`,
      backgroundColor: '#f4f4f4',
      color: type === 'error' ? 'red' : 'green',
      marginBottom: '10px',
    };
  
    return <div style={style}>{message}</div>;
  };
  
  export default Notification;
  