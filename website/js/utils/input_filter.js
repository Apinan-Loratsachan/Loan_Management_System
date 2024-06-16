document.getElementById("searchText").addEventListener("beforeinput", function(e) {
    const nextVal = 
      e.target.value.substring(0, e.target.selectionStart) +
      (e.data ?? '') +
      e.target.value.substring(e.target.selectionEnd)
    ;
    if(!/^(\d{0,13})$/.test(nextVal)) {
        e.preventDefault();
    }
    return;
});