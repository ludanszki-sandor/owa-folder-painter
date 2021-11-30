
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
    if (config.enabled.icons){ // not perfect - don't use
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
    if (config.enabled.folderColors || config.enabled.folderIcons){
        let colorz = nullifyTransparentColors(normalizeColors(compactColors(config.colors)))

        let css_c = colorz.map(item => {
            let folderName = item.folderName
            let color = item.textColor ?? TEXT_TRANSPARENT
            if (!ENABLE_TRANSPARENT_TEXTCOLOR && color === TEXT_TRANSPARENT){
                color = FAKE_TRANSPARENT_COLOR
            }
            let bg_color = item.textBGColor ?? TEXT_TRANSPARENT
            let result = Array()
            if (config.enabled.folderColors){
                let folderColoredStyle = `div[title="${item.folderName}"] i, div[title="${item.folderName}"] span {color:${color};} ` +
                    `div[title="${item.folderName}"] {color:${color}; background-color:${bg_color};} ` +
                    `div[title="${item.folderName}"]:hover {background-color:${bg_color}!important; font-style:italic;}`
                result = result.concat(folderColoredStyle)
            }
            if (config.enabled.folderIcons){
                // A spec. könyvtárakat kihagyjuk! - azoknál más a data-icon-name, azaz saját ikon rendelhető hozzájuk
                // vagy nincs hozzájuk külön data-icon-name
                if (item.folderEmoji !== null && item.folderEmoji !== '') {
                    let stx = generateIconStyleX('nuku',item.folderEmoji,color,ENABLE_TXT2IMAGE_INLINE)
                    let iconEmojiStyle = ` div[role="treeitem"][title="${folderName}"] div i[data-icon-name="FabricFolder"]:before { ${stx.before} }`
                    result = result.concat(iconEmojiStyle)
                }
            }
            return  result.join(' ')
        }).join('\n')
        csss = csss.concat(css_c)
    }
    if (config.enabled.redNumbers){    // number of unread items

        let red = config?.misc?.redNumbers ?? null

        let color = standardize_color(red?.color ?? 'red')
        let BGColor = standardize_color(red?.BGColor ?? null)
        if (BGColor === FAKE_TRANSPARENT_COLOR){
            BGColor = TEXT_TRANSPARENT
        }
        let borderColor = standardize_color(red?.borderColor ?? null)
        if (borderColor === FAKE_TRANSPARENT_COLOR){
            borderColor = TEXT_TRANSPARENT
        }
        let borderRadiusPX = str2int(red?.borderRadiusPX)
        if (borderRadiusPX === false){
            borderRadiusPX = 3
        }
        let items = [
            `color:${color}`,
            `padding-left: 5px`,
            `padding-right: 5px`,
            `padding-top: 1px`,
            `padding-bottom: 1px`,
        ]
        if (BGColor !== TEXT_TRANSPARENT){
            items = items.concat(`background-color:${BGColor}`)
        }
        if (borderColor !== TEXT_TRANSPARENT){
            items = items.concat(`border: 2px solid ${borderColor}`)
            if (0 < borderRadiusPX){
                items = items.concat(`border-radius: ${borderRadiusPX}px`)
            }
        }
        let redStyle = items.join(';')
        let css_red = `div[role="treeitem"] span span span { ${redStyle} }`
        csss = csss.concat(css_red)
    }
    if (1 === 1){
        // div[role="heading"] span[value="FONTOS"]
        //let alma = `div[role="heading"] span[class="_3TFJ6hWkkSKUtXUmmBYdBd _2yY8aBdtjO4JcToI6x-A-r"] { color: yellow; text-background:blue;}`
        let alma = `span[value="FONTOS"] { color: yellow; text-background:blue;}`
        csss = csss.concat(alma)

    }


    let style = document.createElement('style')
    style.textContent = csss.join('\n')
    document.head.appendChild(style)
}



function onFinishWeb(){
    debugLog('onFinishWeb')
    if (DEBUG_COLLECT_ICONS){
        // todo... (not perfect yet)
        let importants = [/*  ide írjuk a mindenképp megjelenítendó data-icon-name értékeket*/]
        let data = iconCollector(importants)
        let len = data.length
        if (0 < len){
            JSONAlert(`nr of collected icons: ${len}\nData will be written to console`)
            console.log(data)
        } else{
            JSONAlert('No icons found 😥')
        }
    }
    //if (config.enabled.folderColors || config.enabled.folderIcons ||config.enabled.icons || config.enabled.icons_OLD || config.enabled.redNumbers){
    if (anythingTrue(config.enabled)){
        modify_webpage(config)
    }
}


browser.storage.local.get(config_field_names).then(onLoadConfigOK,onLoadConfigError).then(onFinishWeb)














