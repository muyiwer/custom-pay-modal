var modalHTML=`
 <div id="echezona-modal" class="echezona-modal">
     <div class="echezona-modal-content" id="echezona-modal-body">
         <span class="echezona-close" id="echezona-close-pop">&times;</span>
         <iframe id="echezona-iframe" src="" frameborder="0"></iframe>
     </div>
 </div>
`;document.body.insertAdjacentHTML("beforeend",modalHTML);var errorCodes={notFound:"1",invalidPublicKey:"2",unauthorized:"3"};const apiBaseUrlDev="https://echezona.somee.com/api/",webBaseUrlDev="https://checkout-echezona.vercel.app/",apiBaseUrlLive="https://echezona.somee.com/api/",webBaseUrlLive="https://checkout-echezona.vercel.app/";var styles=`
      /* Modal styles */
      .echezona-modal {
        display: none;
        position: fixed;
        z-index: 1000;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: none;
        background-color: rgba(0, 0, 0, 0.5);
      }
      .echezona-modal-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        border-radius: 15px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        overflow: none;
      }
      .echezona-close {
        position: absolute;
        top: -15px;
        right: -40px;
        cursor: pointer;
        width: 30px;
        height: 30px;
        border: none;
        background: white;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        color: black;
      }
      .echezona-close:hover{
        background: red;
        color: white;
      }
      .echezona-close::before,
      .echezona-close::after {
        content: '';
        position: absolute;
        width: 2px;
        height: 15px;
        background-color: black;
      }
      .echezona-close::before {
        transform: rotate(45deg);
      }
      .echezona-close::after {
        transform: rotate(-45deg);
      }
      @media only screen and (max-width: 450px) {
        #echezona-iframe {
            width: 100vw !important;
            height: 100vh; !important;
          }
          .echezona-modal-content {
            bottom: -220px !important; 
            left: 50% !important; 
            heigth: 300px;
          }
          .echezona-close {
            position: absolute;
            top: 0px;
            right: 0px;
            cursor: pointer;
            width: 30px;
            height: 30px;
            border: none;
            background: white;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 20px;
            color: black;
          }
      }
      #echezona-iframe {
        width: 400px;
        min-height: 425px;
        overflow: none;
        border: none;
      }
      .payment-loader-container {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      .payment-loader {
        width: 30px;
        height: 30px;
        margin: 0 auto;
      }
      .payment-circle {
        text-align: center;
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
      .payment-inner-circle {
        position: relative;
        left: -12.5%;
        top: 35%;
        width: 125%;
        height: 25%;
        animation: rotate 2s infinite linear;
      }
      .payment-loader-container img {
        position: relative;
        top: -0.9em;
        animation: pulsate 1.25s infinite ease;
      }
  
      @keyframes pulsate {
        0% {
          transform: scale(0.75);
        }
        50% {
          transform: scale(1.75);
        }
        100% {
          transform: scale(0.75);
        }
      }
  
      @keyframes rotate {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `,styleElement=document.createElement("style");async function openModal({authorizeUrl:e,...a}){var t=document.getElementById("echezona-modal"),o=document.getElementById("echezona-modal-body"),n=document.getElementById("echezona-iframe");o.style.display="none";var r=document.createElement("div");r.classList.add("payment-loader-container");var s=document.createElement("div");s.classList.add("payment-loader");var i=document.createElement("div");i.classList.add("payment-circle");var l=document.createElement("div");l.classList.add("payment-inner-circle");var c=document.createElement("img");c.height=50,c.width=50,c.src="https://res.cloudinary.com/dgdwce3rq/image/upload/v1717244441/kyc/okomox3fwitvhix0qate.png",i.appendChild(l),i.appendChild(c),s.appendChild(i),r.appendChild(s),t.appendChild(r),t.style.display="block";let d=null;if(e)d=`${e}?iframe=1`;else{let p=await initializePayment({...a?.request}).catch(()=>{closeModal()});if(p?.success)d=`${p.data?.authorizeUrl}?iframe=1`;else{a.onError&&a.onError(p),closeModal();return}}n.src=d,n.style.display="none",n.onload=async function(){o.style.display="block",s.style.display="none",n.style.display="block",t.style.display="block"}}function closeModal(){document.getElementById("echezona-modal").style.display="none"}async function initializePayment({publicKey:e,mode:a,...t}){return new Promise(a=>{var o=new XMLHttpRequest;let n="https://checkout-echezona.vercel.app/";o.open("POST","https://echezona.somee.com/api/Payments/Initialize"),o.setRequestHeader("Content-type","application/json"),o.setRequestHeader("Authorization","bearer "+e),o.onload=function(){try{var e=JSON.parse(o.responseText);if(o.status>=200&&o.status<300)"00"===e.responseCode?a({success:!0,message:e.responseMessage,data:{authorizeUrl:e.data.paymentUrl,reference:e.data.accessCode}}):a({success:!1,message:e.responseMessage,data:{authorizeUrl:n+errorCodes.unauthorized,reference:""}});else if(400===o.status){var t=e.errors,r=Object.keys(t)[0];a({success:!1,message:t[r][0],data:{authorizeUrl:n+errorCodes.notFound+"/"+r,reference:""}})}else 401===o.status?a({success:!1,message:e.responseMessage,data:{authorizeUrl:n+errorCodes.invalidPublicKey,reference:""}}):500===o.status&&a({success:!1,message:"You are not authorized to use this plugin. Please check your public key.",data:{authorizeUrl:n+errorCodes.unauthorized,reference:""}})}catch(s){a({success:!1,message:o.responseText,data:{authorizeUrl:n+errorCodes.invalidPublicKey,reference:""}})}},o.onerror=function(){a({success:!1,message:"Service Unavailable. Please try again later",data:{authorizeUrl:n+errorCodes.unauthorized,reference:""}})},o.send(JSON.stringify({...t,callBackUrl:"https://echezona.vercel.app/"}))})}styleElement.innerHTML=styles,document.head.appendChild(styleElement);class EchezonaPayPop{constructor(){}newTransaction(e){let{onSuccess:a,onCancel:t,onError:o,authorizeUrl:n}=e;openModal({authorizeUrl:n,...e}),document.getElementById("echezona-close-pop").onclick=function(){t&&t(),closeModal()},window.addEventListener("message",function(e){if("checkout_Response"===e.data.type){let t=e.data?.data;a&&t?.success?a(t):o&&!t?.success&&o(t),closeModal()}})}}module.exports=EchezonaPayPop;