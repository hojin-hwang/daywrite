export default postMessage = (message = null, data = null) =>
{
    window.postMessage({msg:message, data:data}, location.origin);
}   
