var modalHTML=`
 <div id="echezona-modal" class="echezona-modal">
     <div class="echezona-modal-content" id="echezona-modal-body">
         <span class="echezona-close" id="echezona-close-pop">&times;</span>
         <iframe id="echezona-iframe" src="" frameborder="0" allowfullscreen></iframe>
         <span class="echezona-footer" >🔒 Secured by Echezona</span>
     </div>
 </div>
`;document.body.insertAdjacentHTML("beforeend",modalHTML);var errorCodes={notFound:"1",invalidPublicKey:"2",unauthorized:"3"};const apiBaseUrlDev="https://api.staging.echezona.com/api/",webBaseUrlDev="https://checkout.staging.echezona.com/",apiBaseUrlLive="https://api.echezona.com/api/",webBaseUrlLive="https://checkout.echezona.com/";var styles=`
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
        height: auto !important;
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
      .echezona-footer{
        position: absolute;
        bottom: -30px;
        text-align: center;
        width: 100%;
        font-weight: 500
      }
      @media only screen and (max-width: 450px) {
        #echezona-iframe {
            width: 100vw !important;
            height: 100vh; !important;
            overflow: hidden;
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
        overflow: hidden;
        height: 450px;
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
    `,styleElement=document.createElement("style");async function openModal({authorizeUrl:e,...a}){var t=document.getElementById("echezona-modal"),o=document.getElementById("echezona-modal-body"),n=document.getElementById("echezona-iframe");o.style.display="none";var s=document.createElement("div");s.classList.add("payment-loader-container");var r=document.createElement("div");r.classList.add("payment-loader");var i=document.createElement("div");i.classList.add("payment-circle");var c=document.createElement("div");c.classList.add("payment-inner-circle");var l=document.createElement("img");l.height=50,l.width=50,l.src="https://res.cloudinary.com/dgdwce3rq/image/upload/v1717244441/kyc/okomox3fwitvhix0qate.png",i.appendChild(c),i.appendChild(l),r.appendChild(i),s.appendChild(r),t.appendChild(s),t.style.display="block";let d=null;if(e)d=`${e}?iframe=1`;else{let h=await initializePayment({...a?.request}).catch(()=>{closeModal()});if(h?.success)d=`${h.data?.authorizeUrl}?iframe=1`;else{a.onError&&a.onError(h),closeModal();return}}n.src=d,n.style.display="none",n.onload=async function(){o.style.display="block",r.style.display="none",n.style.display="block",t.style.display="block"},window.onload=function(){var e=document.body.scrollHeight;window.parent.postMessage(e,"http://127.0.0.1:5500")}}function closeModal(){document.getElementById("echezona-modal").style.display="none"}async function initializePayment({publicKey:e,mode:a,...t}){return new Promise(o=>{var n=new XMLHttpRequest;let s="Dev"===a?"https://checkout.staging.echezona.com/":"https://checkout.echezona.com/";n.open("POST",("Dev"===a?"https://api.staging.echezona.com/api/":"https://api.echezona.com/api/")+"Payments/Initialize"),n.setRequestHeader("Content-type","application/json"),n.setRequestHeader("Authorization","bearer "+e),n.onload=function(){try{var e=JSON.parse(n.responseText);if(n.status>=200&&n.status<300)"00"===e.responseCode?o({success:!0,message:e.responseMessage,data:{authorizeUrl:e.data.paymentUrl,reference:e.data.accessCode}}):o({success:!1,message:e.responseMessage,data:{authorizeUrl:s+errorCodes.unauthorized,reference:""}});else if(400===n.status){var a=e.errors,t=Object.keys(a)[0];o({success:!1,message:a[t][0],data:{authorizeUrl:s+errorCodes.notFound+"/"+t,reference:""}})}else 401===n.status?o({success:!1,message:e.responseMessage,data:{authorizeUrl:s+errorCodes.invalidPublicKey,reference:""}}):500===n.status&&o({success:!1,message:"You are not authorized to use this plugin. Please check your public key.",data:{authorizeUrl:s+errorCodes.unauthorized,reference:""}})}catch(r){o({success:!1,message:n.responseText,data:{authorizeUrl:s+errorCodes.invalidPublicKey,reference:""}})}},n.onerror=function(){o({success:!1,message:"Service Unavailable. Please try again later",data:{authorizeUrl:s+errorCodes.unauthorized,reference:""}})},n.send(JSON.stringify({...t,callBackUrl:"https://echezona.vercel.app/"}))})}styleElement.innerHTML=styles,document.head.appendChild(styleElement);class EchezonaPayPop{constructor(){}newTransaction(e){let{onSuccess:a,onCancel:t,onError:o,authorizeUrl:n}=e;openModal({authorizeUrl:n,...e}),document.getElementById("echezona-close-pop").onclick=function(){t&&t(),closeModal()},window.addEventListener("message",function(e){"checkout_height"===e.data.type&&(document.getElementById("echezona-iframe").style.height=e.data?.height)}),window.addEventListener("message",function(e){if("checkout_Response"===e.data.type){let t=e.data?.data;a&&t?.success?a(t):o&&!t?.success&&o(t),closeModal()}})}}module.exports=EchezonaPayPop;