
function modify_webpage_OLD(iconz,colorz){
    debugLog(['modify_webpage_OLD',iconz,colorz])
    colorz = nullifyTransparentColors(normalizeColors(compactColors(colorz)))
    iconz = nullifyTransparentIcons(normalizeIcons(compactIcons(iconz)))


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

function modify_webpage(){
    debugLog(['modify_webpage'])
    let csss = Array()
    if (config.enabled.icons){ // not perfect
        let iconz = nullifyTransparentIcons(normalizeIcons(compactIcons(config.icons)))
        let css_i = iconz.map(item =>
            {
                let {iconName,iconText,iconColor} = item
                let newIconColor = iconColor ?? iconColor_DEFAULT
                let st = generateIconStyle(iconName,iconText,newIconColor,ENABLE_TXT2IMAGE_INLINE)
                return `i[data-icon-name="${iconName}"] {${st}}`
            }
        ).join('\n')
        csss = csss.concat(css_i)
    }
    if (config.enabled.icons_OLD){ // old, but good
        let iconsz = nullifyTransparentIcons(normalizeIcons(compactIcons(config.icons)))
        if (iconColor_DEBUG_DEFAULT === null || iconColor_DEBUG_DEFAULT === FAKE_TRANSPARENT_COLOR){
            iconsz = iconsz.filter( item => {return (item.iconText !== '')} )
        }
        let css_b = iconsz.map(item => {
            let {iconName,iconText,iconColor} = item
            let newIconColor = iconColor ?? iconColor_DEFAULT
            let st = generateIconStyleX(iconName,iconText,newIconColor,ENABLE_TXT2IMAGE_INLINE)
            return `i[data-icon-name="${iconName}"]:before {${st.before}}  i[data-icon-name="${iconName}"] {${st.element}}`
        }).join('\n')
        csss = csss.concat(css_b)
    }
    if (config.enabled.colors){
        let colorz = nullifyTransparentColors(normalizeColors(compactColors(config.colors)))
        let css_c = colorz.map(item => {
            let color = item.textColor ?? TEXT_TRANSPARENT
            if (!ENABLE_TRANSPARENT_TEXTCOLOR && color === TEXT_TRANSPARENT){
                color = FAKE_TRANSPARENT_COLOR
            }
            let bg_color = item.textBGColor ?? TEXT_TRANSPARENT
            return `div[title="${item.folderName}"] i, div[title="${item.folderName}"] span {color:${color};} ` +
                `div[title="${item.folderName}"] {color:${color}; background-color:${bg_color};} ` +
                `div[title="${item.folderName}"]:hover {background-color:${bg_color}!important; font-style:italic;}`
        }).join('\n')
        csss = csss.concat(css_c)
    }
    if (config.enabled.redNumbers){
        let css_red = `div[role="treeitem"] span span span {color:red;}`    // number of unread items
        csss = csss.concat(css_red)
    }
    let style = document.createElement('style')
    style.textContent = csss.join('\n')
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
            JSONAlert(`nr of collected icons: ${len}\nData will be written to console`)
            console.log(data)
        } else{
            JSONAlert('No icons found 😥')
        }
    }
    if (config.enabled.colors || config.enabled.icons || config.enabled.icons_OLD || config.enabled.redNumbers){
        modify_webpage(config)
    }
}


browser.storage.local.get(config_field_names).then(onLoadConfigOK,onLoadConfigError).then(onFinishWeb)














