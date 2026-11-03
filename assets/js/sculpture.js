/* Scroll-controlled intro sculpture; never plays independently of scrolling. */
(() => {
  const canvas=document.querySelector('.ion-sculpture');
  if(!canvas)return;
  const context=canvas.getContext('2d');
  const count=61,images=new Array(count),state={frame:0};
  let drawn=-1,next=0;
  const anchors=[0,15,30,45,60];
  const order=[...anchors,...Array.from({length:count},(_,i)=>i).filter(i=>!anchors.includes(i))];
  function render(){
    const target=Math.max(0,Math.min(count-1,Math.round(state.frame)));
    let index=target;
    if(!images[index]){index=-1;for(let d=1;d<count;d++){if(images[target-d]){index=target-d;break}if(images[target+d]){index=target+d;break}}}
    if(index<0||index===drawn)return;
    context.clearRect(0,0,canvas.width,canvas.height);
    context.drawImage(images[index],0,0,canvas.width,canvas.height);
    drawn=index;canvas.dataset.frame=String(index);
  }
  function load(){
    if(next>=order.length)return;
    const index=order[next++],img=new Image();
    img.onload=()=>{images[index]=img;render();load()};img.onerror=load;
    img.src=`assets/sculpture/frame-${String(index).padStart(3,'0')}.webp`;
  }
  window.IonSculpture={state,render,lastFrame:count-1};
  for(let i=0;i<4;i++)load();
})();
