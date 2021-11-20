const colorIDprefix = 'col_'
const colorListSeparator = ';'
const colorTableBodyID = 'folder-painter-folder-options-tbody'

const iconIDprefix = 'ico_'
const iconTableBodyID = 'folder-painter-icon-options-tbody'

const cmdRemoveColor = 'remove-color'
const cmdChangeColor = 'change-color'
const cmdChangeColorNoSave = 'change-color-no-save'

const cmdRemoveIcon = 'remove-icon'
const cmdChangeIcon = 'change-icon'

const emojiDelete = '❌'
const emojiSave = '💾'
const emojiAppend = '➕'
const emojiLoadFile = '✔️'

const emojiResetConfig = '🆑'
const emojiLoadFileRadio = emojiLoadFile


const jsonDivCoreID = 'folder-painter-json-options-div-core'
const cmdLoadJSON = 'load-json'
const loadJSONtextAreaID = 'json-textarea'
const cmdResetConfig = 'reset-config'
const questionResetConfig = 'Are you sure?'

const radiobuttonsDivCoreID = 'folder-painter-radio-buttons-div-core'
const radiobuttonsDivID = 'folder-painter-radio-buttons-div'

const radioGroupName = 'folder-painter-radio-group'

const cmdRadioButton = 'radio-button'

const radioButtonsData_IDs = {
    panel_colors : 'panel_colors',
    panel_icons:'panel_icons',
    panel_json:'panel_json',
    panel_help:'panel_help',
    error: 'error'
}
const radioButtonsData = [
    {id:radioButtonsData_IDs.panel_colors,text:'🎨 - Customize colors',radio_span_id : 'radio-colors'},
    {id:radioButtonsData_IDs.panel_icons,text:'🍒 - Replace icons',radio_span_id : 'radio-icons'},
    {id:radioButtonsData_IDs.panel_json,text:`${emojiLoadFileRadio} - Load from JSON`,radio_span_id : 'radio-json'},
//    {id:radioButtonsData_IDs.panel_help,text:`❓ - Help`,radio_span_id : 'radio-help'}
]

const helpDivCoreID = 'folder-painter-help-options-div-core'
const radioButtonsHTMLSeparator = '&nbsp;&nbsp;'
const formID = 'folder-painter-form-id'

let tooltips = {
    iconName : 'Icon name',
    iconText : 'Icon emoji',
    iconSave : 'Save changes',
    iconDelete : 'Delete entry',

    iconNameNew : 'New icon name',
    iconTextNew : 'New icon emoji',
    iconAppendNew : 'Save new entry',

    folderName : 'Folder name',
    textColor : 'Modify textColor',
    textBGColor : 'Modify textBackgroundColor',
    textDelete : 'Delete entry',

    folderNameNew : 'New folder name',
    textColorNew : 'New textColor',
    textBGColorNew : 'New textBackgroundColor',
    folderAppendNew : 'Save new entry',

    loadConfig : 'Load configuration from JSON',
    resetConfig : 'Reset to default configuration'
}


function restoreOptions(e){
    browser.storage.local.get(config_field_names).then(onLoadConfigOK,onLoadConfigError).then(onFinishConfig)
}

function saveOptions(cfg){
    browser.storage.local.set(cfg).then(onSaveConfigOK,onSaveConfigError)
}

function onFinishConfig(){
    draw_config_table(config)
}

function generate_color_config_table(colorz){
    colorz = sortColors(colorz)

    let rows = Array(0)
    let row
    let folderName
    let textColor
    let textBGColor
    let style
    let f_textColor
    for (let i = 0; i < colorz.length;i++){
        folderName = colorz[i].folderName
        textColor = standardize_color(colorz[i].textColor)
        if (ENABLE_TRANSPARENT_TEXTCOLOR && (textColor === FAKE_TRANSPARENT_COLOR)){
            f_textColor =  standardize_color(TEXT_TRANSPARENT)
        } else {
            f_textColor =  standardize_color(textColor)
        }
        textBGColor = standardize_color(colorz[i].textBGColor)
        style = `color:${f_textColor};background-color:${textBGColor};`
        row = `<tr>
                   <td><input readonly="readonly" type="text" value="${folderName}" title="${tooltips.folderName}" style="${style}"></td>
                   <td><input id="${colorIDprefix}${i}+1" type="color" title="${tooltips.textColor}" value="${textColor}" data-action="${cmdChangeColor}" data-id="${i}" ></td>
                   <td><input id="${colorIDprefix}${i}+2" type="color" title="${tooltips.textBGColor}" value="${textBGColor}" data-action="${cmdChangeColor}" data-id="${i}" ></td>
                   <td><button title="${tooltips.textDelete}" data-action="${cmdRemoveColor}" data-id="${i}">${emojiDelete}</button></td>
              </tr>`
        rows = rows.concat(row)
    }
    let lastTextColor = standardize_color(config.default_values.textColor)
    if (ENABLE_TRANSPARENT_TEXTCOLOR && (lastTextColor === FAKE_TRANSPARENT_COLOR)){
        f_textColor =  standardize_color(TEXT_TRANSPARENT)
    } else {
        f_textColor =  standardize_color(lastTextColor)
    }
    let lastTextBGColor = standardize_color(config.default_values.textBGColor)
    let lastStyle = `color:${f_textColor};background-color:${lastTextBGColor};`
    let lastValue = config.default_values.newFolder
    let lastRow = `<tr>
                        <td>&nbsp;</td>
                        <td></td>
                        <td></td>
                        <td></td>
                   </tr>
                   <tr>
                       <td><input id="${colorIDprefix}-1+0" type="text" placeholder="new folder name" value="${lastValue}" title="${tooltips.folderNameNew}" style="${lastStyle}"></td>
                       <td><input id="${colorIDprefix}-1+1" type="color" title="${tooltips.textColorNew}" value="${lastTextColor}" data-action="${cmdChangeColor}" data-id="-1" ></td>
                       <td><input id="${colorIDprefix}-1+2" type="color" title="${tooltips.textBGColorNew}" value="${lastTextBGColor}" data-action="${cmdChangeColor}" data-id="-1" ></td>
                       <td><button title="${tooltips.folderAppendNew}" data-action="${cmdChangeColor}" data-id="-1">${emojiAppend}</button></td>
                  </tr>`
    rows = rows.concat(lastRow)
    return rows.join('\n')
}

function generate_icon_config_table(iconz){
    iconz = compactIcons(iconz)
    let rows = Array(0)
    let row
    let iconName
    let iconText
    let iconPlaceholder
    for (let i = 0; i < iconz.length;i++){
        iconName = iconz[i].iconName
        iconText = iconz[i].iconText
        iconPlaceholder = find_emoji_placeholder(iconName,'?')
        row = `<tr>
                   <td><input readonly="readonly" type="text" title="${tooltips.iconName}" value="${iconName}"></td>
                   <td><input id="${iconIDprefix}${i}+1" type="text" title="${tooltips.iconText}" class="emoji" placeholder="${iconPlaceholder}" value="${iconText}"></td>
                   <td><button title="${tooltips.iconSave}" data-action="${cmdChangeIcon}" data-id="${i}" >${emojiSave}</button></td>
                   <td><button title="${tooltips.iconDelete}" data-action="${cmdRemoveIcon}" data-id="${i}">${emojiDelete}</button></td>
              </tr>`
        rows = rows.concat(row)
    }
    let lastEmoji = config.default_values.emoji
    let lastRow = `<tr>
                        <td>&nbsp;</td>
                        <td></td>
                        <td></td>
                        <td></td>
                   </tr>
                   <tr>
                       <td><input id="${iconIDprefix}-1+0" type="text" title="${tooltips.iconNameNew}" class="icon_name_input" placeholder="new icon name" value=""></td>
                       <td><input id="${iconIDprefix}-1+1" type="text" title="${tooltips.iconTextNew}" class="emoji" placeholder="emoji" value="${lastEmoji}"></td>
                       <td><button title="${tooltips.iconAppendNew}" data-action="${cmdChangeIcon}" data-id="-1">${emojiAppend}</button></td>
                       <td>&nbsp;</td>
                  </tr>`
    rows = rows.concat(lastRow)
    return rows.join('\n')
}

function generate_public_config_JSON_text(cfg){
    cfg.colors = nullifyTransparentColors(cfg.colors)
    if (JSON_NULL_TO_TRANSPARENT){
        cfg.colors = transparentifyNullColors(cfg.colors)
    }

    let out_cfg = {}
    let field_name
    for (let i = 0;i < config_field_names.length;i++){
        field_name = config_field_names[i]
        if (cfg.hasOwnProperty(field_name) && config_json_enabled_field_names.includes(field_name)){
            out_cfg[field_name] = cfg[field_name]
        }
    }
    return  JSON.stringify(out_cfg,null,2)
}

function generate_json_div(cfg){
    let json = generate_public_config_JSON_text(cfg)
    return `<div class="json_page_div">
                <div>
                    <textarea id="${loadJSONtextAreaID}" placeholder="json comes here" rows="20" >${json}</textarea>
                </div>
                <div>
                    <button class="single_button" data-action="${cmdLoadJSON}" data-id="-1" title="${tooltips.loadConfig}" >${emojiLoadFile}</button>
                    <button class="single_button" data-action="${cmdResetConfig}" data-id="-1" title="${tooltips.resetConfig}" >${emojiResetConfig}</button>
                </div>                 
            </div>`
}

function generate_radiobuttons(active_tab){
    let rows = Array()
    let row
    let id
    let text
    let span_id
    let selected
    let cn
    for (let i = 0; i < radioButtonsData.length; i ++){
        id = radioButtonsData[i].id
        text = radioButtonsData[i].text
        span_id = radioButtonsData[i].radio_span_id
        if (i === active_tab){
            selected = 'checked'
            cn = 'radio-button-active-div'
        } else{
            selected = ''
            cn = 'radio-button-inactive-div'
        }
        row = `<span class="radio-button-common-div ${cn}" id="${span_id}"><input type="radio" id="${id}" name="${radioGroupName}" data-id="${i}" data-action="${cmdRadioButton}" value="${text}" ${selected}>
               <label title="${text}" for="${id}">${text}</label></span>`
        rows = rows.concat(row)
    }
    return rows.join(`${radioButtonsHTMLSeparator}\n`)
}

function loadConfigFromJSONtext(txt){
    let cfg = null
    try {
        cfg = JSON.parse(txt)
    } catch(e) {
        return false
    }
    let field_name
    for (let i = 0;i < config_field_names.length;i++) {
        field_name = config_field_names[i]
        if (cfg.hasOwnProperty(field_name) && config_json_enabled_field_names.includes(field_name)) {
            config[field_name] = cfg[field_name]
        }
    }
    return true
}

function generate_help_div(){
    return `<div class="help_div">
                todo: help contents  
           </div>`
}

function render_radio(cfg){
    debugLog(['render_radio - active_tab:',cfg.active_tab])
    let content = generate_radiobuttons(cfg.active_tab)
    return `
            <div id="${radiobuttonsDivID}">
                <div class="radio-button-panel" id = "${radiobuttonsDivCoreID}">
                    ${content}
                </div>
            </div>`
}

function render_color_config_table(colors){
    let content = generate_color_config_table(colors)
    return `
            <div id="folder-painter-folder-options-div" class="colors_page_div">
                <table>
                    <thead>
                        <tr>
                            <th>Folder name</th>
                            <th>Text color</th>
                            <th>Text BG</th>
                            <th>Add/Remove</th>
                        </tr>
                    </thead>
                    <tbody id="${colorTableBodyID}">
                        ${content}
                    </tbody>
                </table>
            </div>`
}

function render_icon_config_table(icons){
    let content = generate_icon_config_table(icons)
    return `
            <div id="folder-painter-icon-options-div" class="icons_page_div">
                <table>
                    <thead>
                        <tr>
                            <th>data-icon-name</th>
                            <th>Emoji</th>
                            <th>Save</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody id="${iconTableBodyID}">
                        ${content}
                    </tbody>
                </table>
            </div>`
}

function render_json_div(cfg){
    let content = generate_json_div(cfg)
    return `
            <div id="folder-painter-json-options-div">
                <div id="${jsonDivCoreID}">
                    ${content}
                </div>
            </div>`
}

function render_help_div(){
    let content = generate_help_div()
    return `
            <div id="folder-painter-help-options-div">
                <div id="${helpDivCoreID}">
                    ${content}
                </div>
            </div>`
}

function render(cfg){
    debugLog(['render - active_tab:',cfg.active_tab])
    let radio = render_radio(cfg)
    let content = 'error'
    let activePanelID = radioButtonsData[cfg.active_tab].id ?? radioButtonsData_IDs.error
    if (activePanelID === radioButtonsData_IDs.panel_colors){
        content = render_color_config_table(cfg.colors)
    } else if (activePanelID === radioButtonsData_IDs.panel_icons){
        content = render_icon_config_table(cfg.icons)
    } else if (activePanelID === radioButtonsData_IDs.panel_json){
        content = render_json_div(cfg)
    } else if (activePanelID === radioButtonsData_IDs.panel_help){
        content = render_help_div()
    } else {
        // error
    }
    return `
    ${radio}
    <div class="separator_div"></div>
    ${content}`
}

function draw_config_table(cfg){
    document.getElementById(formID).innerHTML = render(cfg)
}

function confirmation(question){
    return window.confirm(question)
}

function colorChanged(id){
    let idx = str2int(id)
    if (idx !== false) {
        if (idx === -1) {
            return true
        } else if (0 <= idx && idx < config.colors.length){
            let oldTextColor = standardize_color(config.colors[idx].textColor)
            let newTextColor = standardize_color(document.getElementById(colorIDprefix + id + '+1').value)

            let oldTextBGColor = standardize_color(config.colors[idx].textBGColor)
            let newTextBGColor = standardize_color(document.getElementById(colorIDprefix + id + '+2').value)

            let changed = (newTextColor !== oldTextColor) || (newTextBGColor !== oldTextBGColor)
            debugLog(['colorChanged',changed,oldTextColor,oldTextBGColor,'->',newTextColor,newTextBGColor])
            return changed
        }
    }
    return false
}

function handleChange(e){
    let control_type = e.target.tagName.toLowerCase()
    let action = e.target.getAttribute('data-action')
    let id = e.target.getAttribute('data-id')
    debugLog(['handleChange',e.target.id,control_type,action,id])
    if (control_type === 'input' && action === cmdChangeColor){
        if (colorChanged(id)) {
            let e = document.getElementById(formID)
            if (id === '-1'){
                action = cmdChangeColorNoSave
            }
            e.submit()
            processButtonClick(action,id)
        }
    }
}

function handleClick(e){
    let control_type = e.target.tagName.toLowerCase()
    let action = e.target.getAttribute('data-action')
    let id = e.target.getAttribute('data-id')
    debugLog(['handleClick',e.target.id,control_type,action,id])

    if (control_type === 'button') {
        processButtonClick(action,id)
    } else if (control_type === 'input') {
        if (action === cmdRadioButton) {
            processButtonClick(action,id)
        } else {
            debugLog(['Control type: ', control_type,'invalid action/id:',action,id])
        }
    } else{
        debugLog(['Not handled control type: ', control_type])
    }
}

function processButtonClick(action,id){
    let idx = str2int(id)
    debugLog(['processButtonClick',action,id,idx])
    if (idx === false) {
        return false
    }
    if (action === cmdChangeColorNoSave){
        if (id === '-1') {
            config.default_values.newFolder = document.getElementById(colorIDprefix + id + '+0').value
            config.default_values.textColor = document.getElementById(colorIDprefix + id + '+1').value
            config.default_values.textBGColor = document.getElementById(colorIDprefix + id + '+2').value
        } else {
            return false
        }
    } else if (action === cmdRemoveColor) {
        // remove color item
        config.colors = config.colors.filter(
            (item,index) => {return (index !== idx)}
        )
    } else if (action === cmdChangeColor) {
        if (id === '-1') {
            // we can add multiple texts (with the same color), separated by 'colorListSeparator' (;)
            let newFolderNames = document.getElementById(colorIDprefix + id + '+0').value.split(colorListSeparator)
            let newTextColor = document.getElementById(colorIDprefix + id + '+1').value
            let newTextBGColor = document.getElementById(colorIDprefix + id + '+2').value
            for (let j = 0; j < newFolderNames.length; j++) {
                config.colors = config.colors.concat(
                    {
                        folderName: newFolderNames[j],
                        textColor: newTextColor,
                        textBGColor: newTextBGColor
                    }
                )
            }
            config.default_values.newFolder = ''
            config.default_values.textColor = newTextColor
            config.default_values.textBGColor = newTextBGColor
        } else {
            // modify color item
            config.colors[idx] = {
                folderName: config.colors[idx].folderName,
                textColor: document.getElementById(colorIDprefix + id + '+1').value,
                textBGColor: document.getElementById(colorIDprefix + id + '+2').value,
            }
        }

    } else if (action === cmdRemoveIcon) {
        // remove icon item
        config.icons = config.icons.filter(
            (item,index) => {return (index !== idx)}
        )
    } else if (action === cmdChangeIcon) {
        if (id === '-1') {
            let newIconName = document.getElementById(iconIDprefix + id + '+0').value
            let newIconText = document.getElementById(iconIDprefix + id + '+1').value
            config.icons = config.icons.concat( {iconName: newIconName, iconText: newIconText} )
            config.default_values.emoji = newIconText
        } else {
            // modify icon item
            config.icons[idx] = {
                iconName: config.icons[idx].iconName,
                iconText: document.getElementById(iconIDprefix + id + '+1').value
            }
        }

    } else if (action === cmdRadioButton) {
        config.active_tab = idx
        draw_config_table(config)
    } else if (action === cmdLoadJSON) {
        let txt = document.getElementById(loadJSONtextAreaID).value
        let ok = loadConfigFromJSONtext(txt)
        if (!ok) {
            return false
        }
    } else if (action === cmdResetConfig){
        if (confirmation(questionResetConfig)){
            config.icons = make_default_icons()
            config.colors = make_default_colors(config.outlook_language)
        }
    } else {
        // invalid action
        debugLog(['invalid action:',action,id])
        return false
    }
    config.icons = normalizeIcons(sortIcons(compactIcons(config.icons.reverse())))
    config.colors = nullifyTransparentColors(normalizeColors(sortColors(compactColors(config.colors.reverse()))))
    saveOptions(config)

    return true
}


document.addEventListener("DOMContentLoaded", restoreOptions)
document.querySelector("form").addEventListener('click', handleClick,false)
document.querySelector("form").addEventListener('change', handleChange,false)

//document.addEventListener("DOMContentLoaded", restoreOptions)

