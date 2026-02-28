export const getData = ()=>{
  try {
    const serializedState = localStorage.getItem('auth')
    if(!serializedState)
    {
      return undefined

    }
  return JSON.parse(serializedState)
    
  } catch (err) {
    console.log('failer', err);
    return undefined
    
  }
};


export const saveData = (state:any)=>{
  try {


    localStorage.setItem('auth', JSON.stringify(state)) //Browsers only store strings in localStorage.
    
  } catch (err) {
    console.log('failed', err)
    return undefined
    
  }

};