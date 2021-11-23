const DEBUG_COLLECT_ICONS = false   // homemade stuff for collecting dataIconNames
const FORCE_RESET_CONFIG = false    // for recreating config settings
const DEBUG_LOG_MODE_LOG = false    // debug messages to console - Warning: console log disabled on Mozilla config page!
const DEBUG_LOG_MODE_ALERT = false  // show debug messages as alert() messages
const DEBUG_SHOW_RAW_CONTENT = false // show panels' content as text instead of html
const JSON_NULL_TO_TRANSPARENT = true // JSON export: replace 'transparent' colors to null
const ENABLE_TRANSPARENT_TEXTCOLOR = false // transparent text colors enabled?
const TOP_SEARCH_BAR = true // draw searchbar on the top of the table or to the bottom?


const FAKE_TRANSPARENT_COLOR = '#ffffff'    // this color means transparent
const LANG_CODE = 'en'  // only used for creating default directory colors - en/hu
const TEXT_TRANSPARENT = 'transparent'
const icon_valid_fields = ['iconName','iconText']
const color_valid_fields = ['folderName','textColor','textBGColor']
const color_color_fields = {all: ['textColor','textBGColor'],
                            fg: ['textColor'],
                            bg:  ['textBGColor']}
const config_field_names = ['colors','icons','active_tab','enabled','outlook_language','default_values']
const config_json_enabled_field_names = ['colors','icons']
const lang_codes = {en:'en',hu:'hu'}

let config = {
    icons: make_default_icons(),
    colors: make_default_colors(LANG_CODE),
    active_tab : 1,
    outlook_language : LANG_CODE,
    enabled : true,
    default_values : {newFolder : '', textColor : 'blue', textBGColor: TEXT_TRANSPARENT, iconName : '', emoji : ''}
}

function iconNameDatabase(){
  return  {
      Add: '\ue710',
      AddEvent: '\ueeb5',
      AddFavorite: '\uf0c8',
      AddFriend: '\ue8fa',
      AddIn: '\uf775',  // no preview (invalid char?)
      Archive: '\uf03f',
      Attach: '\ue723',
      Blocked: '\ue733',
      BoxLogo: '\ued75',
      Broom: '\uea99',
      Calendar: '\ue787',
      Camera: '\ue722',
      Cancel: '\ue711',
      Chat: '\ue901',
      ChevronDown: '\ue70d',
      ChevronDownMed: '\ue972',
      ChevronRight: '\ue76c',
      ChevronRightMed: '\ue974',
      CircleFill: '\uea3b',
      CircleRing: '\uea3a',
      Clock: '\ue917',
      ClosePane: '\ue89f',
      CollapseContent: '',
      CommentUrgent: '\uf307',
      ComposeRegular: '\u2611',// svg:pencil in a square
      Contact: '\ue77b',
      ContactList: '\uf7e5',
      Copy: '\ue8c8',
      Delete: '\ue74d',
      Down: '\ue74b',
      DropboxLogo: '\ued77',
      Edit: '\ue70f',
      EgnyteLogo: '\uf373',
      EmojiTabSymbols: '\ued58',
      EndPointSolid: '\ueb4b',
      ExploreContent: '\ueccd',
      FabricFolder: '\uf0a9',
      FabricMovetoFolder: '\uf0a5',
      FabricUserFolder: '\uf5e5',
      FavoriteStarFill: '\ue735',
      Filter: '\ue71c',
      Flag: '\ue7c1',
      Forward: '\ue72a',
      FullScreen: '\ue740',
      GlobalNavButton: '\ue700',
      GotoToday: '\ue8d1',
      Important: '\ue8c9',
      Inbox: '\uf41c',
      Info: '\ue946',
      Like: '\ue8e1',
      LikeSolid: '\uf3bf',
      LinkedInLogo: '\uf20a',
      List: '\uea37',
      Mail: '\ue715',
      MicrosoftTranslatorLogo: '\uf782',
      MiniExpandMirrored: '\uea5a',
      More: '\ue712',
      MoreVertical: '\uf2bc',
      NotePinned: '\ued9a',
      OfficeChat: '\uf70f',
      Page: '\ue7c3',
      People: '\ue716',
      Phone: '\ue717',
      Photo2: '\ueb9f',
      Pin: '\ue718',
      PinnedSolid: '\uf676',
      Play: '\ue768',
      PlayerSettings: '\uef58',
      POI: '\uecaf',
      Print: '\ue749',
      QuickNote: '\ue70b',
      Read: '\ue8c3',
      RecruitmentManagement: '\uee12',
      ReminderGroup: '\uebf8',
      RemoveFromTrash: '\uf82b',
      Reply: '\ue97a',
      ReplyAll: '\uee0a',
      RevToggleKey: '\ue845',
      Search: '\ue721',
      Send: '\ue724',
      Settings: '\ue713',
      Share: '\ue72d',
      SortDown: '\uee69',
      StarFilled: '\u2605', // svg: filled star
      StatusCircleCheckmark: '\uf13e',
      Tag: '\ue8ec',
      TagSolid: '\uf70e',
      ToDoLogoOutline: '\uf75b',
      Undo: '\ue7a7',
      Up: '\ue74a',
      Video: '\ue714'
  }
}

function debugLog(v){
    if (DEBUG_LOG_MODE_LOG || DEBUG_LOG_MODE_ALERT){
        let txt = JSON.stringify(v)
        if (DEBUG_LOG_MODE_LOG){
            console.log(txt)
        }
        if (DEBUG_LOG_MODE_ALERT){
            alert(txt)
        }
    }
}

function debugAlert(v){
    let txt = JSON.stringify(v)
    alert(txt)
}


function make_default_icons(){
    const emojis = {
        Inbox: '📮',
        Edit: '✏',
        Send: '📯',
        Delete: '🗑',
        Blocked: '💩',
        Archive: '🏴‍☠',
        QuickNote: '🧾',
        FabricFolder: '📭',
        ChevronRightMed: '👉',
        ChevronDownMed: '👇'}
    let db = iconNameDatabase()
    return Object.keys(db).map(key =>
        {
            return {iconName:key, iconText: (emojis.hasOwnProperty(key) ? emojis[key] : '')    }
        } )
}

function find_emoji_placeholder(dataIconName,defaultResult){
    let db = iconNameDatabase()
    if (db.hasOwnProperty(dataIconName)){
        return db[dataIconName]
    } else {
        return defaultResult
    }
}


function make_default_colors(lang){
    const default_colors = {
        en : [
            ['Inbox', '#004753'],
            ['Drafts', '#004753'],
            ['Sent Items', '#004753'],
            ['Deleted Items', 'teal'],
            ['Junk Email', 'brown'],
            ['Archive', 'blue'],
            ['Notes', 'blue'],
            ['Conversation History', '#5e5eac']
        ],
        hu : [
            ['Beérkezett üzenetek', '#004753'],
            ['Piszkozatok', '#004753'],
            ['Elküldött elemek', '#004753'],
            ['Törölt elemek', 'teal'],
            ['Levélszemét', 'brown'],
            ['Archívum', 'blue'],
            ['Feljegyzések', 'blue'],
            ['Beszélgetési előzmények', '#5e5eac']
        ]
    }
    let lang_code
    if (!default_colors.hasOwnProperty(lang)){
        lang_code = Object.keys(default_colors)[0]
        debugLog(['lang mofified:',lang,lang_code])
    } else {
        lang_code = lang
    }
    return default_colors[lang_code].map(item => ({folderName:item[0], textColor:item[1], textBGColor: TEXT_TRANSPARENT}) )
}

function standardize_color(str){
    if (str === null){
        return FAKE_TRANSPARENT_COLOR
    }
    if (str.toLowerCase() === TEXT_TRANSPARENT){
        return FAKE_TRANSPARENT_COLOR
    }

    let ctx = document.createElement("canvas").getContext("2d");
    ctx.fillStyle = str;
    return ctx.fillStyle;
}

function onLoadConfigOK(data){
    debugLog(['onLoadConfigOK',data])
    let field_name
    let loaded_field
    for (let i = 0;i < config_field_names.length;i++){
        field_name = config_field_names[i]
        if (data.hasOwnProperty(field_name)){
            loaded_field = data[field_name]
            if (FORCE_RESET_CONFIG) {
                //
            } else {
                config[field_name] = loaded_field
            }
        } else {
            debugLog(['missing field:',field_name])
        }
    }
}

function onLoadConfigError(error){
    debugLog(['onLoadConfigError',error])
}


function onSaveConfigOK(data){
    debugLog(['onSaveConfigOK',data])
}

function onSaveConfigError(error){
    debugLog(['onSaveConfigError',error])
}

function str2int(s){
    let i = parseInt(s,10)
    if (isNaN(i)){
        return false
    } else {
        return i
    }
}

function sortColors(colors){
    return colors.sort( ( a , b) => a.folderName.localeCompare(b.folderName)  )
}

function normalizeArray(arr,valid_fields){
    let result = Array()
    let item
    let new_item
    let field
    for(let i = 0;i < arr.length;i++){
        item = arr[i]
        new_item = {}
        for (let j = 0;j < valid_fields.length;j++){
            field = valid_fields[j]
            new_item[field] = item[field] ?? null
        }
        result = result.concat(new_item)
    }
    return result
}

function replaceArrayValues(arr,fromWhat,toWhat,color_field_names){
    let result = Array()
    let item
    let field_name
    for(let i = 0;i < arr.length;i++){
        item = arr[i]
        for (let j = 0;j < color_field_names.length;j++){
            field_name = color_field_names[j]
            if (item.hasOwnProperty(field_name)){
                if (item[field_name] === fromWhat) {
                    item[field_name] = toWhat
                }
            }
        }
        result = result.concat(item)
    }
    return result
}


function nullifyTransparentColors(colors){
    if (ENABLE_TRANSPARENT_TEXTCOLOR){
        let temp = replaceArrayValues(colors,FAKE_TRANSPARENT_COLOR,null,color_color_fields.all)
        return replaceArrayValues(temp,TEXT_TRANSPARENT,null,color_color_fields.all)
    } else {
        let temp1 = replaceArrayValues(colors,FAKE_TRANSPARENT_COLOR,null,color_color_fields.bg)
        let temp2 = replaceArrayValues(temp1,TEXT_TRANSPARENT,null,color_color_fields.bg)
        return replaceArrayValues(temp2,TEXT_TRANSPARENT,FAKE_TRANSPARENT_COLOR,color_color_fields.fg)

    }


/*    let color_field_names
    if (ENABLE_TRANSPARENT_TEXTCOLOR){
        color_field_names = color_color_fields.all
    } else {
        color_field_names = color_color_fields.bg
    }
    return replaceArrayValues(colors,FAKE_TRANSPARENT_COLOR,null,color_field_names) */
}

function transparentifyNullColors(colors){
    if (ENABLE_TRANSPARENT_TEXTCOLOR){
        return replaceArrayValues(colors,null,TEXT_TRANSPARENT,color_color_fields.all)
    } else{
        let temp = replaceArrayValues(colors,null,TEXT_TRANSPARENT,color_color_fields.bg)
        return replaceArrayValues(temp,null,FAKE_TRANSPARENT_COLOR,color_color_fields.fg)
    }
}

function normalizeColors(colors){
    return  normalizeArray(colors,color_valid_fields)
}

function normalizeIcons(icons){
    let temp = normalizeArray(icons,icon_valid_fields)
    return replaceArrayValues(temp,null,'',icon_valid_fields)
}

function compactColors(colors){
    let seen = {}
    return colors.filter(item => {
        if (item.folderName === ''){
            return false
        }
        if (seen.hasOwnProperty(item.folderName)) {
            debugLog(['compactColors - removed:',item])
            return false
        } else {
            seen[item.folderName] = true
            return true
        }
    })
}

function sortIcons(icons){
    return icons.sort( (a,b) => a.iconName.localeCompare(b.iconName) )
}

function compactIcons(icons){
    let seen = {}
    return icons.filter(item => {
        if (item.iconName === ''){
            return false
        }
        if (seen.hasOwnProperty(item.iconName)) {
            debugLog(['compactIcons - removed:',item])
            return false
        } else {
            seen[item.iconName] = true
            return true
        }
    })
}

function iconCollector(importants){
    let inputs = document.getElementsByTagName('i')
    let found = Array()
    let iconName
    let hint
    let existing_hint
    let new_item
    let defaulthintvalue = '???'
    let important

    for(let i = 0; i < inputs.length; i++) {
        iconName = inputs[i].dataset.iconName
        hint = inputs[i].innerText
        important = importants.includes(iconName)
        if (important || hint !== ''){
            existing_hint = find_emoji_placeholder(iconName,defaulthintvalue)
            if (important || existing_hint === defaulthintvalue || existing_hint === ''){
                new_item = {iconName:iconName, iconText:hint, important: important}
                found = found.concat(new_item)
            }
        }
    }
    return compactIcons(found)
    //return found
}


