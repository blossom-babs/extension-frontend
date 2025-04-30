window.addEventListener("load", () => {
    const observer = new MutationObserver(() => {
      const composeWindows = document.querySelectorAll('[role="dialog"]');
      console.log('composeWindows', composeWindows)
      composeWindows.forEach((dialogNode) => {
        console.log('dialogNode', dialogNode)

        const composeBody = dialogNode.querySelector('[aria-label="Message Body"]');
        const alreadyInjected = composeBody?.querySelector('[data-tracking-pixel]');
  
        if (composeBody && !alreadyInjected) {
          console.log("Compose window detected, injecting pixel...");
          handleNewCompose(dialogNode);
        }
      });
    });
  
    observer.observe(document.body, { childList: true, subtree: true });
  });
  

async function  handleNewCompose(dialogNode) {
    const composedBody = dialogNode.querySelector('[aria-label="Message Body"]')
    const recipientField = dialogNode.querySelector('textarea[name="to"]'); // "To" field
    const subjectField = dialogNode.querySelector('input[name="subjectbox"]');

    if(!composedBody) return;
    console.log("Compose detected, generating pixel...");

    const recipientEmail = recipientField.value.trim().toLowerCase() || "";
    const subjectTitle = subjectField.value.trim() || "";



    try {
        const pixelUrl = await generateTrackingPixel(recipientEmail, subjectTitle)
        if(!pixelUrl) return

        if(composedBody.querySelector('[data-tracking-pixel]')) return

        const hiddenDiv = document.createElement('div')
        hiddenDiv.setAttribute('data-tracking-pixel', 'true')
        hiddenDiv.style.width = '0px'
        hiddenDiv.style.height = '0px'
        hiddenDiv.style.overflow = 'hidden'
        hiddenDiv.style.opacity = '0'

        const img = document.createElement('img')
        img.src = pixelUrl
        img.width = 1
        img.height = 1
        img.style.display='block'
        img.style.border='0'
        img.style.margin='0'
        img.style.padding='0'
        img.alt=''

        hiddenDiv.appendChild(img)

        composedBody.appendChild(hiddenDiv)

        console.log("Tracking pixel injected:", pixelUrl);

    } catch (error) {
        console.error("Error injecting tracking pixel:", error);
    }
}

async function generateTrackingPixel(recipientEmail, subjectTitle) {
    try {
 const response = await fetch (`https://ffszheimkvqtifcnvcfm.supabase.co/functions/v1/create-pixel`, {
        method: 'POST',
        headers: {
          'content-Type': 'application/json',
        //   'Authorization': `${SUPABASE.AUTH}`
        },
        body: JSON.stringify({email_title: subjectTitle, recipient: recipientEmail})
      })

      if(!response.ok){
        return null
      }

      const data = await response.json()
      return data.pixelUrl
    
    } catch (error) {
        console.error("Error generating pixel:", error);
        return null
    }
    
}