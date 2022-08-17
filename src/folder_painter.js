
function modify_webpage(){
    debugLog(['modify_webpage'])
    let csss = Array()
    if (config.enabled.icons){
        let iconsz = nullifyTransparentIcons(normalizeIcons(compactIcons(config.icons)))
        if (iconColor_DEBUG_DEFAULT === null || iconColor_DEBUG_DEFAULT === FAKE_TRANSPARENT_COLOR){
            iconsz = iconsz.filter( item => {return (item.iconText !== '')} )
        }
        let css_b = iconsz.map(item => {
            let {iconName,iconText,iconColor} = item
            let newIconColor = iconColor ?? iconColor_DEFAULT
            let st = generateIconStyleX(iconText,newIconColor,ENABLE_TXT2IMAGE_INLINE,iconName)
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
                    `div[title="${item.folderName}"] {color:${color}; background-color:${bg_color};} `
                result = result.concat(folderColoredStyle)
            }
            if (config.enabled.folderIcons){
                let fabrika = sz_FABRIC_FOLDER
                // A spec. könyvtárakat kihagyjuk! - azoknál más a data-icon-name, azaz saját ikon rendelhető hozzájuk
                // vagy nincs hozzájuk külön data-icon-name
                if (item.folderEmoji !== null && item.folderEmoji !== '') {
                    let stx = generateIconStyleX(item.folderEmoji,color,ENABLE_TXT2IMAGE_INLINE,null)
                    let iconEmojiStyle = ` div[role="treeitem"][title="${folderName}"] div i[data-icon-name="${fabrika}"]:before { ${stx.before} }`
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
    if (config.enabled.svgModify){ // csak 2205-től volt érvényes, de 2208-tól már nem kell
        let icosz = nullifyTransparentIcons(normalizeIcons(compactIcons(config.icons)))
        let css_s = icosz.map(item => {
            let {iconName, iconText} = item
            if (iconText == '' || iconText == null){
                //return `i[data-icon-name="${iconName}"] span svg {color:red;}`
                return ''
            } else {
                return `i[data-icon-name="${iconName}"] span svg {display:none;}`
            }
        }).join('\n')
        csss = csss.concat(css_s)
    }
    if (config.enabled.mod2208){ // 2208-tól érvényes módosítások
        let icosz = nullifyTransparentIcons(normalizeIcons(compactIcons(config.icons)))
        let css_2208 = icosz.map(item => {
            let {iconName, iconText} = item
            if (iconText == '' || iconText == null){
                //return `i[data-icon-name="${iconName}"] span i {color:red;}`
                return ''
            } else {
                return `i[data-icon-name="${iconName}"] span i {display:none;}`
            }
        }).join('\n')
        csss = csss.concat(css_2208)


    }
    if (config.enabled.hover){
        let hoverBGColor =  config.misc.hover.BGColor
        let colorssz = nullifyTransparentColors(normalizeColors(compactColors(config.colors)))
        let css_h = colorssz.map(item => {
            let folderName = item.folderName
            return `div[title="${folderName}"]:hover {background-color:${hoverBGColor}!important; font-style:italic;} `
        }).join('\n')
        csss = csss.concat(css_h)
    }
    let style = document.createElement('style')
    style.textContent = csss.join('\n')
    document.head.appendChild(style)
}


function onFinishWeb(){
    debugLog('onFinishWeb')
    if (DEBUG_COLLECT_ICONS){
        // todo... (not perfect yet)
        // Meghatározzuk a mindenképp megjelenítendő data-icon-name értékeket
        let db = iconNameDatabase()
        let importants = Object.keys(db).map(key =>
        {
             return db[key] == "?" ? key : ""
        } ).filter(value => value !== "")
        // további elemeket fűzhetünk hozzá...
        //importants.concat( ['AppsRegular', 'ArrowForwardRegular', 'ArrowReplyAllRegular', 'ArrowUndoRegular', 'AttachRegular'] )
        let data = iconCollector(importants,true)
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
