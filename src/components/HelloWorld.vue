<script setup>
import { RouterLink } from 'vue-router'
//import postMessage from '../assets/js/message-post';

//postMessage("message", {data:300});

// setTimeout(()=>{
  
// },1000) 
window.postMessage({msg:"Test", data:null}, location.origin);

defineProps({
  msg: {
    type: String,
    required: true
  }
})

window.addEventListener("message", function(event){
  const window_url = `http://${window.location.hostname}`;
    // if(event.origin !== window_url) {
    //   console.log(window_url);
    //   console.log(event.origin);
    //   return;
    // }
    if(event.data?.msg){
      console.log(event.data.msg);
    }
}, false);


</script>

<template>
  <div class="greetings">
    <section class="header">
      <h1 class="green"><RouterLink to="/playground/vue-work">{{ msg }}</RouterLink></h1>
      <nav>
        <RouterLink to="/playground/vue-work/read/">Read</RouterLink>
        <RouterLink to="/playground/vue-work/write/">write</RouterLink>
      </nav>
    </section>
    
    <section>
      <p>
        한문장을 써보세요. 당신의 인생을 바꿔보세요.
      </p>
      <p>
        한문장을 써보세요. 당신의 인생을 바꿔보세요.
      </p>
    </section>
  </div>
</template>

<style scoped>
section.header{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
nav{
  display: flex;
  gap:12px;
}
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
