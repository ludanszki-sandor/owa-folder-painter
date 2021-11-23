
function modify_webpage(iconz,colorz){
    debugLog(['modify_webpage',iconz,colorz])
    colorz = nullifyTransparentColors(normalizeColors(compactColors(colorz)))
    iconz = normalizeIcons(compactIcons(iconz))

    iconz = iconz.filter( item => {return (item.iconText !== '')} )

    let css1 = iconz.map(item => {
        return `i[data-icon-name="${item.iconName}"]:before {color:black; font-family:"Segoe UI Emoji"; content:"${item.iconText}";margin-right:-12px;} ` +
               `i[data-icon-name="${item.iconName}"] {color:transparent !important;}`
    }).join('\n')
    let css2 = colorz.map(item => {
        let color = item.textColor ?? TEXT_TRANSPARENT
        if (!ENABLE_TRANSPARENT_TEXTCOLOR && color === TEXT_TRANSPARENT){
            color = FAKE_TRANSPARENT_COLOR
        }
        let bg_color = item.textBGColor ?? TEXT_TRANSPARENT
        return `div[title="${item.folderName}"] i, div[title="${item.folderName}"] span {color:${color};} ` +
               `div[title="${item.folderName}"] {color:${color}; background-color:${bg_color};} ` +
               `div[title="${item.folderName}"]:hover {background-color:${bg_color}!important; font-style:italic;}`
    }).join('\n')
    let css3 = `div[role="treeitem"] span span span {color:red}`    // number of unread items
    let style = document.createElement('style')
    // 'innerHTML' direct modification is a security risk, so we use 'textContent'
    style.textContent = [css1, css2, css3].join('\n')
    document.head.appendChild(style)
}


function onFinishWeb(){
    debugLog('onFinishWeb')
    if (DEBUG_COLLECT_ICONS){
        // todo... (not perfect yet)
        let importants = ['AddIn','CollapseContent' /*,'ComposeRegular','StarFilled'*/]
        let data = iconCollector(importants)
        let len = data.length
        if (0 < len){
            debugAlert(`nr of collected icons: ${len}\nData will be written to console`)
            console.log(data)
        } else{
            debugAlert('No icons found 😥')
        }
    }
    if (config.enabled){
        modify_webpage(config.icons,config.colors)
    }
}


browser.storage.local.get(config_field_names).then(onLoadConfigOK,onLoadConfigError).then(onFinishWeb)














