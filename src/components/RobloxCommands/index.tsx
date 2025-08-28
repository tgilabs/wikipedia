import type {ReactNode} from 'react';
import React, { useState } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch,
  faUser,
  faEye,
  faPalette,
  faUserEdit,
  faSnowflake,
  faFire,
  faGem,
  faRocket,
  faShieldAlt,
  faMagic,
  faGamepad,
  type IconDefinition
} from '@fortawesome/free-solid-svg-icons';
import styles from './styles.module.css';

type RobloxCommand = {
  command: string;
  description: string;
  example: string;
  aliases?: string[];
  category: 'appearance' | 'effects' | 'player' | 'camera' | 'utility' | 'fun';
  icon: IconDefinition;
  undo?: string;
};

const robloxCommands: RobloxCommand[] = [
  // Utility Commands
  {
    command: 'cmdbar',
    description: 'Opens the command bar',
    example: ';cmdbar',
    aliases: ['commandBar'],
    category: 'utility',
    icon: faGamepad,
  },
  {
    command: 'refresh Player',
    description: 'Clears any and all effects and loops from yourself, or the from the player with the specified name',
    example: ';refresh builderman',
    aliases: ['re', 'reset'],
    category: 'utility',
    icon: faRocket,
  },
  {
    command: 'respawn Player',
    description: 'Makes you, or the player with the specified name, respawn',
    example: ';respawn builderman',
    aliases: ['res'],
    category: 'utility',
    icon: faUser,
  },
  {
    command: 'follow Player',
    description: 'Teleports you to the server that the player with the specified name is in (must be in the same game)',
    example: ';follow builderman',
    aliases: ['join', 'joinServer'],
    category: 'utility',
    icon: faRocket,
  },
  
  // Appearance Commands
  {
    command: 'shirt Player Asset ID',
    description: 'Changes the shirt of the specified player',
    example: ';shirt builderman 1',
    category: 'appearance',
    icon: faUserEdit,
  },
  {
    command: 'pants Player Asset ID',
    description: 'Changes the pants of the specified player',
    example: ';pants builderman 1324804528',
    category: 'appearance',
    icon: faUserEdit,
  },
  {
    command: 'hat Player Asset ID',
    description: 'Changes the hat of the specified player',
    example: ';hat builderman 186956940',
    aliases: ['accessory'],
    category: 'appearance',
    icon: faUserEdit,
  },
  {
    command: 'clearHats Player',
    description: 'Removes your hat. If you specify the name of a player, it will remove their hat',
    example: ';clearHats builderman',
    aliases: ['clrHats', 'clearAccessories', 'clrAccessories', 'removeHats', 'removeAccessories'],
    category: 'appearance',
    icon: faUserEdit,
  },
  {
    command: 'face Player Asset ID',
    description: 'Changes the face of the specified player',
    example: ';face builderman 7074764',
    category: 'appearance',
    icon: faUserEdit,
  },
  {
    command: 'bundle Player Asset ID',
    description: 'Applies the specified bundle to the character with the specified name',
    example: ';bundle builderman 291',
    aliases: ['package'],
    category: 'appearance',
    icon: faUserEdit,
  },
  {
    command: 'char Player Player',
    description: 'Sets the specified player\'s model (and all clothes, etc) to that of another player\'s',
    example: ';char builderman robloxplayer',
    aliases: ['become'],
    category: 'appearance',
    icon: faUserEdit,
    undo: 'unChar',
  },
  {
    command: 'morph Player Morph',
    description: 'Changes the specified player into the specified morph',
    example: ';morph builderman Justin',
    category: 'appearance',
    icon: faUserEdit,
  },
  {
    command: 'r15 Player',
    description: 'Sets the model of your character, or the player with the specified name, to R15',
    example: ';r15 builderman',
    category: 'appearance',
    icon: faUserEdit,
  },
  {
    command: 'r6 Player',
    description: 'Sets the model of your character, or the player with the specified name, to R6',
    example: ';r6 builderman',
    category: 'appearance',
    icon: faUserEdit,
  },
  {
    command: 'dino Player',
    description: 'Turns your character, or the player with the specified name, into a dinosaur',
    example: ';dino builderman',
    aliases: ['TRex', 'dinosaur'],
    category: 'appearance',
    icon: faUserEdit,
  },

  // Player Control Commands
  {
    command: 'invisible Player',
    description: 'Makes you invisible, or makes the player with the specified name invisible',
    example: ';invisible builderman',
    aliases: ['invis'],
    category: 'player',
    icon: faEye,
    undo: 'visible',
  },
  {
    command: 'jump Player',
    description: 'Makes your character jump, or if you specify a player\'s name, that player will jump',
    example: ';jump builderman',
    category: 'player',
    icon: faUser,
  },
  {
    command: 'sit Player',
    description: 'Makes your character sit, or if you specify a player\'s name, that player will sit',
    example: ';sit builderman',
    category: 'player',
    icon: faUser,
  },
  {
    command: 'freeze Player',
    description: 'Freezes your character, or the player with the specified name. A player who has been frozen is anchored to their current position and cannot interact with the world',
    example: ';freeze builderman',
    aliases: ['anchor'],
    category: 'player',
    icon: faSnowflake,
    undo: 'unFreeze',
  },
  {
    command: 'jail Player',
    description: 'Puts your character, or the character with the specified name, in a glass jail cell',
    example: ';jail builderman',
    aliases: ['jailCell', 'jc'],
    category: 'player',
    icon: faShieldAlt,
    undo: 'unJail',
  },
  {
    command: 'ice Player',
    description: 'Puts your character, or the player with the specified name, in a giant ice cube',
    example: ';ice builderman',
    category: 'player',
    icon: faSnowflake,
    undo: 'unIce',
  },

  // Effects Commands
  {
    command: 'paint Player Color',
    description: 'Changes the color of the specified player',
    example: ';paint builderman red',
    aliases: ['color', 'colour'],
    category: 'effects',
    icon: faPalette,
  },
  {
    command: 'material Player Material',
    description: 'Changes the material of the specified player. Make sure you remove any effects (e.g. color) that may prevent the material change from showing',
    example: ';material builderman Wood',
    aliases: ['mat', 'surface'],
    category: 'effects',
    icon: faPalette,
  },
  {
    command: 'reflectance Player Reflectance',
    description: 'Sets the specified player\'s reflectance (in other words, how much they reflect light or how shiny they are)',
    example: ';reflectance builderman 0.5',
    aliases: ['ref', 'shiny'],
    category: 'effects',
    icon: faGem,
  },
  {
    command: 'transparency Player Transparency',
    description: 'Sets the transparency of the specified player',
    example: ';transparency builderman 0.5',
    aliases: ['trans'],
    category: 'effects',
    icon: faEye,
  },
  {
    command: 'glass Player',
    description: 'Applies a glass effect to your character, or if you specify a player\'s name, that player',
    example: ';glass builderman',
    category: 'effects',
    icon: faGem,
  },
  {
    command: 'neon Player',
    description: 'Applies a neon effect to your character, or if you specify a player\'s name, that player',
    example: ';neon builderman',
    category: 'effects',
    icon: faGem,
  },
  {
    command: 'shine Player',
    description: 'Applies a shine effect to your character, or if you specify a player\'s name, that player',
    example: ';shine builderman',
    category: 'effects',
    icon: faGem,
  },
  {
    command: 'ghost Player',
    description: 'Applies a ghost effect to your character, or if you specify a player\'s name, that player',
    example: ';ghost builderman',
    category: 'effects',
    icon: faEye,
  },
  {
    command: 'gold Player',
    description: 'Applies a gold effect to your character, or if you specify a player\'s name, that player',
    example: ';gold builderman',
    category: 'effects',
    icon: faGem,
  },
  {
    command: 'forceField Player',
    description: 'Spawns a forcefield around your player, or the player with the specified name',
    example: ';ff builderman',
    aliases: ['ff'],
    category: 'effects',
    icon: faShieldAlt,
    undo: 'unForceField',
  },
  {
    command: 'fire Player',
    description: 'Spawns fire around your character, or the player with the specified name',
    example: ';fire builderman',
    category: 'effects',
    icon: faFire,
    undo: 'unFire',
  },
  {
    command: 'smoke Player',
    description: 'Spawns smoke around your character, or the player with the specified name',
    example: ';smoke builderman',
    category: 'effects',
    icon: faFire,
    undo: 'unSmoke',
  },
  {
    command: 'sparkles Player',
    description: 'Spawns sparkles around your character, or the player with the specified name',
    example: ';sparkles builderman',
    category: 'effects',
    icon: faGem,
    undo: 'unSparkles',
  },
  {
    command: 'nightVision Player',
    description: 'Gives night vision to your player, or the player with the name specified',
    example: ';nightVision builderman',
    aliases: ['nv'],
    category: 'effects',
    icon: faEye,
  },

  // Size/Body Modification Commands
  {
    command: 'bigHead Player',
    description: 'Makes the head of your character, or player with the specified name, very big',
    example: ';bigHead builderman',
    aliases: ['bhead'],
    category: 'appearance',
    icon: faMagic,
    undo: 'unBigHead',
  },
  {
    command: 'smallHead Player',
    description: 'Makes the head of your character, or player with the specified name, very small',
    example: ';smallHead builderman',
    aliases: ['shead'],
    category: 'appearance',
    icon: faMagic,
    undo: 'unSmallHead',
  },
  {
    command: 'potatoHead Player',
    description: 'Makes the head of your character, or player with the specified name, a potato',
    example: ';potatoHead builderman',
    aliases: ['phead'],
    category: 'appearance',
    icon: faMagic,
    undo: 'unPotatoHead',
  },
  {
    command: 'dwarf Player',
    description: 'Makes your model, or the model of the player with the specified name, very small (like a dwarf)',
    example: ';dwarf builderman',
    category: 'appearance',
    icon: faMagic,
    undo: 'unDwarf',
  },
  {
    command: 'giant Player',
    description: 'Makes your model, or the model of the player with the specified name, very big (like a giant)',
    example: ';giant builderman',
    category: 'appearance',
    icon: faMagic,
    undo: 'unGiant',
  },
  {
    command: 'size Player Amount',
    description: 'Scales the model of the player with the specified name by the specified amount',
    example: ';size builderman 2',
    category: 'appearance',
    icon: faMagic,
    undo: 'unSize',
  },
  {
    command: 'bodyTypeScale Player Scale',
    description: 'Scales up or down the body of player with the specified name by the specified amount. This is different to the size command in that it scales the model proportions correctly',
    example: ';bodyTypeScale builderman 2',
    aliases: ['btScale'],
    category: 'appearance',
    icon: faMagic,
    undo: 'unBodyTypeScale',
  },
  {
    command: 'depth Player Scale',
    description: 'Scales the depth of the specified player\'s model by the specified amount',
    example: ';depth builderman 2',
    aliases: ['dScale', 'depthScale'],
    category: 'appearance',
    icon: faMagic,
    undo: 'unDepth',
  },
  {
    command: 'headSize Player Scale',
    description: 'Scales the specified player\'s head by the specified amount',
    example: ';headSize builderman 0.5',
    aliases: ['headScale'],
    category: 'appearance',
    icon: faMagic,
    undo: 'unHeadSize',
  },
  {
    command: 'height Player Scale',
    description: 'Scales the specified player\'s height by the specified amount',
    example: ';height builderman 2',
    aliases: ['hScale', 'heightScale'],
    category: 'appearance',
    icon: faMagic,
    undo: 'unHeight',
  },
  {
    command: 'hipHeight Player Scale',
    description: 'Scales the specified player\'s hip height by the specified amount',
    example: ';hipHeight builderman 3',
    aliases: ['hip'],
    category: 'appearance',
    icon: faMagic,
    undo: 'unHipHeight',
  },
  {
    command: 'squash Player',
    description: 'Squashes your player, or the player with the specified name',
    example: ';squash builderman',
    aliases: ['flat', 'flatten'],
    category: 'appearance',
    icon: faMagic,
    undo: 'unSquash',
  },
  {
    command: 'proportion Player Scale',
    description: 'Scales the specified player\'s proportions by the specified amount',
    example: ';proportion builderman 2',
    aliases: ['pScale', 'proportionScale'],
    category: 'appearance',
    icon: faMagic,
    undo: 'unProportion',
  },
  {
    command: 'width Player Scale',
    description: 'Scales the specified player\'s width by the specified amount',
    example: ';width builderman 0.5',
    aliases: ['wScale', 'widthScale'],
    category: 'appearance',
    icon: faMagic,
    undo: 'unWidth',
  },
  {
    command: 'fat Player',
    description: 'Makes your player, or the player with the specified name, fat',
    example: ';fat builderman',
    aliases: ['obese'],
    category: 'appearance',
    icon: faMagic,
    undo: 'unFat',
  },
  {
    command: 'thin Player',
    description: 'Makes your player, or the player with the specified name, thin',
    example: ';thin builderman',
    aliases: ['skinny'],
    category: 'appearance',
    icon: faMagic,
    undo: 'unThin',
  },

  // Fun Commands
  {
    command: 'spin Player Speed',
    description: 'Makes the your character, or the specified player, spin at the specified speed',
    example: ';spin builderman 1',
    category: 'fun',
    icon: faMagic,
    undo: 'unSpin',
  },
  {
    command: 'rainbowFart Player',
    description: 'Makes your character, or the player with the specified name, play an "interesting" animation',
    example: ';rainbowFart builderman',
    aliases: ['poo', 'poop'],
    category: 'fun',
    icon: faMagic,
  },
  {
    command: 'icecream Player',
    description: 'Makes an ice cream van appear and take your character, or the player with the specified name, away (and then return them a few seconds later)',
    example: ';icecream builderman',
    aliases: ['ic', 'clown'],
    category: 'fun',
    icon: faMagic,
  },

  // Camera/UI Commands
  {
    command: 'view Player',
    description: 'Makes your camera follow the player with the specified name',
    example: ';view builderman',
    aliases: ['watch', 'spectate'],
    category: 'camera',
    icon: faEye,
    undo: 'view',
  },
  {
    command: 'warp Player',
    description: 'Plays a "wrap" camera animation for your camera, or for the player with the specified name',
    example: ';warp builderman',
    category: 'camera',
    icon: faEye,
  },
  {
    command: 'blur Player Amount',
    description: 'Blurs the camera of the specified player by the specified amount',
    example: ';blur builderman 10',
    category: 'camera',
    icon: faEye,
  },
  {
    command: 'hideGuis Player',
    description: 'Hides GUIs for your player, or the player with the specified name',
    example: ';hideGuis builderman',
    category: 'camera',
    icon: faEye,
    undo: 'showGuis',
  },
  {
    command: 'name Player Name Fake Name',
    description: 'Sets the display name of the specified player to a fake name',
    example: ';name builderman awesomename1337',
    aliases: ['fakeName'],
    category: 'player',
    icon: faUser,
    undo: 'unName',
  },
  {
    command: 'hideName Player',
    description: 'Hides your name, or the name of the specified player',
    example: ';hideName builderman',
    category: 'player',
    icon: faEye,
    undo: 'showName',
  },
];

const categoryNames = {
  appearance: 'Appearance',
  effects: 'Effects',
  player: 'Player Control',
  camera: 'Camera & UI',
  utility: 'Utility',
  fun: 'Fun Commands'
};

const categoryIcons = {
  appearance: faUserEdit,
  effects: faGem,
  player: faUser,
  camera: faEye,
  utility: faGamepad,
  fun: faMagic
};

function CommandCard({command, description, example, aliases, undo, icon}: RobloxCommand) {
  return (
    <div className={styles.commandCard}>
      <div className={styles.commandHeader}>
        <div className={styles.commandIconContainer}>
          <FontAwesomeIcon icon={icon} className={styles.commandIcon} />
        </div>
        <div className={styles.commandInfo}>
          <code className={styles.commandName}>;</code>
          <code className={styles.commandName}>{command}</code>
          {undo && (
            <div className={styles.undoCommand}>
              <span className={styles.undoLabel}>Undo:</span>
              <code className={styles.undoCommandName}>;{undo}</code>
            </div>
          )}
        </div>
      </div>
      <div className={styles.commandBody}>
        <p className={styles.commandDescription}>{description}</p>
        <div className={styles.commandExample}>
          <span className={styles.exampleLabel}>Example:</span>
          <code className={styles.exampleCode}>{example}</code>
        </div>
        {aliases && aliases.length > 0 && (
          <div className={styles.commandAliases}>
            <span className={styles.aliasesLabel}>Aliases:</span>
            <div className={styles.aliasesList}>
              {aliases.map((alias, idx) => (
                <code key={idx} className={styles.aliasCode}>{alias}</code>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RobloxCommands(): ReactNode {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredCommands = robloxCommands.filter(cmd => {
    const matchesSearch = cmd.command.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cmd.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (cmd.aliases && cmd.aliases.some(alias => alias.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesCategory = selectedCategory === 'all' || cmd.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) {
      acc[cmd.category] = [];
    }
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, RobloxCommand[]>);

  return (
    <section className={styles.commandsSection}>
      <div className="container">
        <div className="text--center margin-bottom--lg">
          <Heading as="h1" className={clsx('font-karantina', styles.mainTitle)}>
            Roblox VIP Commands
          </Heading>
          <p className={clsx('font-assistant', styles.subtitle)}>
            Looking to ban.. or explode a player? You're in the right place.
          </p>
          <div className={styles.adminInfo}>
            <p className={clsx('font-assistant', styles.infoText)}>
              Please make sure you select the correct admin command plugin from below. HD Admin and Kohl's Admin Infinite have different commands.
            </p>
            <div className={styles.adminTabs}>
              <div className={clsx(styles.adminTab, styles.activeTab)}>HD Admin</div>
              <div className={styles.adminTab}>Kohl's Admin Infinite</div>
            </div>
          </div>
        </div>

        <div className={styles.helpSection}>
          <Heading as="h2" className={styles.helpTitle}>How to Use HD Admin Commands</Heading>
          <ol className={styles.helpSteps}>
            <li>Hit the <code>'</code> key on your keyboard</li>
            <li>Type a command into the text box and hit enter!</li>
          </ol>
        </div>

        <div className={styles.controlsSection}>
          <div className={styles.searchContainer}>
            <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search HD Admin commands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.categoryFilters}>
            <button
              className={clsx(styles.categoryButton, selectedCategory === 'all' && styles.activeCategoryButton)}
              onClick={() => setSelectedCategory('all')}
            >
              All Commands
            </button>
            {Object.entries(categoryNames).map(([key, name]) => (
              <button
                key={key}
                className={clsx(styles.categoryButton, selectedCategory === key && styles.activeCategoryButton)}
                onClick={() => setSelectedCategory(key)}
              >
                <FontAwesomeIcon icon={categoryIcons[key]} className={styles.categoryIcon} />
                {name}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.commandsContainer}>
          {Object.entries(groupedCommands).map(([category, commands]) => (
            <div key={category} className={styles.categorySection}>
              <Heading as="h3" className={styles.categoryTitle}>
                <FontAwesomeIcon icon={categoryIcons[category]} className={styles.categoryTitleIcon} />
                {categoryNames[category]}
                <span className={styles.commandCount}>({commands.length})</span>
              </Heading>
              <div className={styles.commandsGrid}>
                {commands.map((cmd, idx) => (
                  <CommandCard key={`${category}-${idx}`} {...cmd} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredCommands.length === 0 && (
          <div className={styles.noResults}>
            <p>No commands found matching your search criteria.</p>
          </div>
        )}

        <div className={styles.vipBadge}>
          <span className={styles.rankLabel}>Rank Required:</span>
          <span className={styles.vipLabel}>VIP</span>
        </div>
      </div>
    </section>
  );
}
