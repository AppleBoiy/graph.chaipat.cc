/* eslint-disable @typescript-eslint/no-explicit-any */

export type NodeClass = 'root' | 'domain' | 'system' | 'validation' | 'tech';

export interface KGNode {
  id: string;
  label: string;
  class: NodeClass;
}

export interface KGLink {
  source: string;
  target: string;
  label: string;
}

export interface NeighborResult {
  nodes: KGNode[];
  links: KGLink[];
}

// -----------------------------------------------------------------
// Adjacency List Database
// -----------------------------------------------------------------
export const FULL_GRAPH: Record<string, NeighborResult> = {
  // --- ADS DOMAIN (Existing) ---
  'ads': {
    nodes: [
      { id: 'perception', label: 'Perception Hub', class: 'system' },
      { id: 'planning',   label: 'Motion Planning', class: 'system' },
      { id: 'kg',         label: 'Knowledge Graph', class: 'domain' },
      { id: 'safety',     label: 'Safety Engine', class: 'validation' },
      { id: 'imu',        label: 'Inertial Unit', class: 'tech' },
      { id: 'gnss',       label: 'GPS/GNSS Hub', class: 'tech' },
      { id: 'canbus',     label: 'CAN Controller', class: 'system' },
      { id: 'hmi',        label: 'User Interface', class: 'domain' },
      { id: 'telemetry',  label: 'Cloud Sync', class: 'tech' },
      { id: 'v2x',        label: 'V2X Comms', class: 'tech' },
      { id: 'diagnostics',label: 'Sys Health', class: 'validation' },
      { id: 'power_ads',  label: 'Power Distr', class: 'tech' },
      { id: 'thermal',    label: 'Cooling Sys', class: 'tech' },
      { id: 'storage_a',  label: 'Black Box', class: 'domain' },
      { id: 'hd_maps',    label: 'HD Map Eng', class: 'system' },
      { id: 'ota',        label: 'OTA Updates', class: 'system' },
      { id: 'sec_ads',    label: 'ADS Security', class: 'validation' },
      { id: 'perception_v', label: 'Perception V', class: 'validation' },
      { id: 'planning_v',   label: 'Planning V', class: 'validation' },
      { id: 'kg_v',         label: 'KG Verify', class: 'validation' },
      { id: 'safety_v',     label: 'Safety Audit', class: 'validation' },
    ],
    links: [
      { source: 'ads', target: 'perception', label: 'sees' },
      { source: 'ads', target: 'planning',   label: 'decides' },
      { source: 'ads', target: 'kg',         label: 'stores' },
      { source: 'ads', target: 'safety',     label: 'guards' },
      { source: 'ads', target: 'imu',        label: 'senses' },
      { source: 'ads', target: 'gnss',       label: 'locates' },
      { source: 'ads', target: 'canbus',     label: 'links' },
      { source: 'ads', target: 'hmi',        label: 'displays' },
      { source: 'ads', target: 'telemetry',  label: 'syncs' },
      { source: 'ads', target: 'v2x',        label: 'talks' },
      { source: 'ads', target: 'diagnostics',label: 'checks' },
      { source: 'ads', target: 'power_ads',  label: 'feeds' },
      { source: 'ads', target: 'thermal',    label: 'cools' },
      { source: 'ads', target: 'storage_a',  label: 'records' },
      { source: 'ads', target: 'hd_maps',    label: 'localizes' },
      { source: 'ads', target: 'ota',        label: 'patches' },
      { source: 'ads', target: 'sec_ads',    label: 'secures' },
      { source: 'perception', target: 'perception_v', label: 'validates' },
      { source: 'planning', target: 'planning_v', label: 'validates' },
      { source: 'kg', target: 'kg_v', label: 'validates' },
      { source: 'safety', target: 'safety_v', label: 'validates' },
      { source: 'imu', target: 'perception', label: 'fused' },
      { source: 'gnss', target: 'hd_maps', label: 'refs' },
      { source: 'canbus', target: 'planning', label: 'controls' },
      { source: 'planning', target: 'safety', label: 'check' },
      { source: 'perception', target: 'kg', label: 'adds' },
      { source: 'v2x', target: 'planning', label: 'informs' },
      { source: 'diagnostics', target: 'hmi', label: 'alerts' },
      { source: 'telemetry', target: 'storage_a', label: 'uploads' },
      { source: 'hd_maps', target: 'perception', label: 'filters' },
      { source: 'sec_ads', target: 'ota', label: 'guards' },
      { source: 'thermal', target: 'power_ads', label: 'monitors' },
    ],
  },

  // --- HEALTHCARE DOMAIN ---
  'perception': {
    nodes: [
      { id: 'camera',       label: 'Camera Fusion', class: 'system' },
      { id: 'lidar',        label: 'LiDAR Cluster', class: 'tech'   },
      { id: 'radar',        label: 'Radar Front',   class: 'tech' },
      { id: 'ultrasonic',   label: 'Short Range',   class: 'tech' },
      { id: 'fusion_hub',   label: 'Sensor Fusion', class: 'system' },
      { id: 'tracking',     label: 'Object Track',  class: 'system' },
      { id: 'segmentation', label: 'Semantic Seg',  class: 'tech' },
      { id: 'pointcloud',   label: 'Pointcloud F',  class: 'tech' },
      { id: 'occupancy',    label: 'Occ. Grid',     class: 'domain' },
      { id: 'lane_detect',  label: 'Lane Tracking', class: 'system' },
      { id: 'sign_recog',   label: 'Traffic Sign',  class: 'system' },
      { id: 'night_vision', label: 'Thermal IR',    class: 'tech' },
      { id: 'rain_sensor',  label: 'Weather Det.',  class: 'tech' },
      { id: 'calibration_p',label: 'Extrinsics V',  class: 'validation' },
      { id: 'latency_p',    label: 'Frame Timing',  class: 'validation' },
    ],
    links: [
      { source: 'perception', target: 'camera', label: 'input' },
      { source: 'perception', target: 'lidar',  label: 'input' },
      { source: 'perception', target: 'radar',  label: 'input' },
      { source: 'perception', target: 'fusion_hub', label: 'fuses' },
      { source: 'camera', target: 'segmentation', label: 'stream' },
      { source: 'lidar',  target: 'pointcloud',   label: 'raw' },
      { source: 'fusion_hub', target: 'tracking', label: 'targets' },
      { source: 'tracking', target: 'occupancy',  label: 'updates' },
      { source: 'segmentation', target: 'lane_detect', label: 'masks' },
      { source: 'radar', target: 'fusion_hub', label: 'delta' },
      { source: 'ultrasonic', target: 'fusion_hub', label: 'near' },
      { source: 'calibration_p', target: 'fusion_hub', label: 'aligns' },
      { source: 'latency_p', target: 'fusion_hub', label: 'syncs' },
    ],
  },
  
  'planning': {
    nodes: [
      { id: 'trajectory',   label: 'Trajectory Opt', class: 'tech'   },
      { id: 'behavior',     label: 'Behavior Arb.', class: 'system' },
      { id: 'prediction',   label: 'Intent Pred.',  class: 'system' },
      { id: 'astar',        label: 'A* Global Path', class: 'tech' },
      { id: 'local_plan',   label: 'Local Planner', class: 'system' },
      { id: 'constraints',  label: 'Kinematic Cons', class: 'domain' },
      { id: 'fallback',     label: 'Safety Stop',   class: 'validation' },
      { id: 'intersection', label: 'Junction Logic',class: 'system' },
      { id: 'highway',      label: 'Cruising Eng.', class: 'system' },
      { id: 'parking',      label: 'Auto Parking',  class: 'system' },
      { id: 'comfort',      label: 'Ride Quality',  class: 'domain' },
      { id: 'collision_av', label: 'Avoidance Sys', class: 'validation' },
    ],
    links: [
      { source: 'planning', target: 'trajectory', label: 'optimizes' },
      { source: 'planning', target: 'behavior',   label: 'orchestrates' },
      { source: 'behavior', target: 'prediction', label: 'queries' },
      { source: 'planning', target: 'astar',      label: 'routes' },
      { source: 'astar',    target: 'local_plan', label: 'guides' },
      { source: 'local_plan', target: 'trajectory', label: 'refines' },
      { source: 'trajectory', target: 'constraints', label: 'obeys' },
      { source: 'behavior', target: 'fallback',   label: 'triggers' },
      { source: 'planning', target: 'comfort',    label: 'monitors' },
      { source: 'constraints', target: 'collision_av', label: 'guards' },
    ],
  },

  'diagnostics': {
    nodes: [
      { id: 'cpu_load',     label: 'CPU Analyzer',  class: 'tech' },
      { id: 'mem_audit',    label: 'Leak Monitor',  class: 'tech' },
      { id: 'temp_log',     label: 'Thermal Feed',  class: 'tech' },
      { id: 'error_log',    label: 'Error Handler', class: 'system' },
      { id: 'watchdog',     label: 'Sys Watchdog',  class: 'validation' },
      { id: 'blackbox',     label: 'FDR Write',     class: 'domain' },
      { id: 'network_h',    label: 'Bandwidth Mon', class: 'tech' },
      { id: 'power_h',      label: 'Voltage Check', class: 'validation' },
      { id: 'sensor_h',     label: 'Sens Integrity', class: 'validation' },
      { id: 'actuator_h',   label: 'Actuator FB',   class: 'validation' },
    ],
    links: [
      { source: 'diagnostics', target: 'cpu_load', label: 'probes' },
      { source: 'diagnostics', target: 'watchdog', label: 'guards' },
      { source: 'watchdog',    target: 'error_log', label: 'reports' },
      { source: 'error_log',   target: 'blackbox',  label: 'records' },
      { source: 'sensor_h',    target: 'error_log', label: 'alerts' },
      { source: 'power_h',     target: 'diagnostics', label: 'status' },
      { source: 'network_h',   target: 'telemetry', label: 'metrics' },
    ],
  },
  'genomics': {
    nodes: [
      { id: 'crispr', label: 'CRISPR v2', class: 'tech' },
      { id: 'sequencing', label: 'DNA Seq Eng', class: 'system' },
      { id: 'variants', label: 'Variant Lib', class: 'domain' },
    ],
    links: [
      { source: 'genomics', target: 'crispr', label: 'edits' },
      { source: 'genomics', target: 'sequencing', label: 'reads' },
      { source: 'genomics', target: 'variants', label: 'indexes' },
    ],
  },

  // --- FINANCE DOMAIN ---
  'finance': {
    nodes: [
      { id: 'blockchain', label: 'L1 Blockchain', class: 'tech' },
      { id: 'trading',    label: 'Algo Trading', class: 'system' },
      { id: 'fraud',      label: 'Fraud Detect', class: 'validation' },
      { id: 'assets',     label: 'Digital Assets', class: 'domain' },
      { id: 'ledger',     label: 'Immutable DB', class: 'tech' },
      { id: 'compliance', label: 'KYC/AML Eng', class: 'validation' },
    ],
    links: [
      { source: 'finance',    target: 'blockchain', label: 'protocol' },
      { source: 'finance',    target: 'trading',    label: 'executes' },
      { source: 'finance',    target: 'fraud',      label: 'monitors' },
      { source: 'finance',    target: 'assets',     label: 'manages' },
      { source: 'finance',    target: 'ledger',     label: 'records' },
      { source: 'finance',    target: 'compliance', label: 'verifies' },
      { source: 'trading',    target: 'fraud',      label: 'scans' },    // LATERAL LINK
      { source: 'blockchain', target: 'ledger',     label: 'writes' },   // CROSS LINK
    ],
  },
  'blockchain': {
    nodes: [
      { id: 'nodes', label: 'Validator Net', class: 'system' },
      { id: 'contracts', label: 'Smart Contract', class: 'tech' },
      { id: 'wallets', label: 'Vault Storage', class: 'domain' },
    ],
    links: [
      { source: 'blockchain', target: 'nodes', label: 'consensus' },
      { source: 'blockchain', target: 'contracts', label: 'executes' },
      { source: 'blockchain', target: 'wallets', label: 'secures' },
    ],
  },

  // --- SPACE DOMAIN ---
  'space': {
    nodes: [
      { id: 'propulsion', label: 'Ion Drive', class: 'tech' },
      { id: 'navigation', label: 'Star Tracker', class: 'system' },
      { id: 'mars', label: 'Mars Colony', class: 'domain' },
      { id: 'satellites', label: 'LTM Network', class: 'system' },
      { id: 'launch', label: 'Rocket Stage', class: 'tech' },
      { id: 'habitat', label: 'Life Support', class: 'validation' },
    ],
    links: [
      { source: 'space', target: 'propulsion', label: 'thrust' },
      { source: 'space', target: 'navigation', label: 'guidance' },
      { source: 'space', target: 'mars', label: 'target' },
      { source: 'space', target: 'satellites', label: 'comms' },
      { source: 'space', target: 'launch', label: 'lifts' },
      { source: 'space', target: 'habitat', label: 'sustains' },
    ],
  },

  // --- QUANTUM DOMAIN ---
  'quantum': {
    nodes: [
      { id: 'qubit', label: 'Qubit Control', class: 'tech' },
      { id: 'crypto', label: 'Post-Quantum', class: 'validation' },
      { id: 'computing', label: 'Supercomputing', class: 'system' },
      { id: 'entangle', label: 'Entanglement', class: 'domain' },
      { id: 'cooling', label: 'Cryogenic Sys', class: 'tech' },
      { id: 'logic', label: 'Quantum Gate', class: 'system' },
    ],
    links: [
      { source: 'quantum', target: 'qubit', label: 'state' },
      { source: 'quantum', target: 'crypto', label: 'secures' },
      { source: 'quantum', target: 'computing', label: 'scales' },
      { source: 'quantum', target: 'entangle', label: 'links' },
      { source: 'quantum', target: 'cooling', label: 'stabilizes' },
      { source: 'quantum', target: 'logic', label: 'processes' },
    ],
  },

  // --- ROBOTICS DOMAIN ---
  'robotics': {
    nodes: [
      { id: 'kinematics', label: 'Inverse Kinem.', class: 'tech' },
      { id: 'cobot', label: 'Collab Robot', class: 'system' },
      { id: 'grasping', label: 'Soft Grasp', class: 'tech' },
      { id: 'vision', label: 'Visual Servo', class: 'system' },
      { id: 'safety_r', label: 'Collision Prot', class: 'validation' },
      { id: 'path', label: 'Dynamic Path', class: 'domain' },
    ],
    links: [
      { source: 'robotics', target: 'kinematics', label: 'motion' },
      { source: 'robotics', target: 'cobot', label: 'platform' },
      { source: 'robotics', target: 'grasping', label: 'actuation' },
      { source: 'robotics', target: 'vision', label: 'feedback' },
      { source: 'robotics', target: 'safety_r', label: 'guards' },
      { source: 'robotics', target: 'path', label: 'plans' },
    ],
  },
  'cobot': {
    nodes: [
      { id: 'hri', label: 'Human-Robot Int', class: 'domain' },
      { id: 'torque', label: 'Torque Sensor', class: 'tech' },
    ],
    links: [
      { source: 'cobot', target: 'hri', label: 'interface' },
      { source: 'cobot', target: 'torque', label: 'feedback' },
    ],
  },

  // --- CLIMATE DOMAIN ---
  'climate': {
    nodes: [
      { id: 'modeling', label: 'Global Model', class: 'system' },
      { id: 'carbon', label: 'Direct Capture', class: 'tech' },
      { id: 'policy', label: 'Net Zero 2050', class: 'domain' },
      { id: 'oceans', label: 'Acidification', class: 'domain' },
      { id: 'renewables', label: 'Grid Mix Eng', class: 'system' },
      { id: 'emissions', label: 'GHG Tracker', class: 'validation' },
    ],
    links: [
      { source: 'climate', target: 'modeling', label: 'predicts' },
      { source: 'climate', target: 'carbon', label: 'mitigates' },
      { source: 'climate', target: 'policy', label: 'governance' },
      { source: 'climate', target: 'oceans', label: 'monitors' },
      { source: 'climate', target: 'renewables', label: 'optimizes' },
      { source: 'climate', target: 'emissions', label: 'verifies' },
    ],
  },

  // --- BIO DOMAIN ---
  'bio': {
    nodes: [
      { id: 'crispr_b', label: 'CRISPR v3', class: 'tech' },
      { id: 'synthetic', label: 'Synth Biology', class: 'domain' },
      { id: 'protein', label: 'Fold Engine', class: 'system' },
      { id: 'pathogen', label: 'Bio-Defense', class: 'validation' },
      { id: 'pharma', label: 'Drug Discover', class: 'system' },
      { id: 'tissue', label: '3D Bioprint', class: 'tech' },
    ],
    links: [
      { source: 'bio', target: 'crispr_b', label: 'edits' },
      { source: 'bio', target: 'synthetic', label: 'fabricates' },
      { source: 'bio', target: 'protein', label: 'simulates' },
      { source: 'bio', target: 'pathogen', label: 'screens' },
      { source: 'bio', target: 'pharma', label: 'screens' },
      { source: 'bio', target: 'tissue', label: 'prints' },
    ],
  },

  // --- SMART CITY DOMAIN ---
  'smartcity': {
    nodes: [
      { id: 'iot', label: 'Edge Sensors', class: 'tech' },
      { id: 'traffic', label: 'Flow Opt.', class: 'system' },
      { id: 'grid', label: 'Smart Grid', class: 'domain' },
      { id: 'waste', label: 'Waste Mgmt', class: 'system' },
      { id: 'safety_s', label: 'Public Safety', class: 'validation' },
      { id: 'lighting', label: 'Adaptive Light', class: 'tech' },
    ],
    links: [
      { source: 'smartcity', target: 'iot', label: 'senses' },
      { source: 'smartcity', target: 'traffic', label: 'directs' },
      { source: 'smartcity', target: 'grid', label: 'powers' },
      { source: 'smartcity', target: 'waste', label: 'optimizes' },
      { source: 'smartcity', target: 'safety_s', label: 'monitors' },
      { source: 'smartcity', target: 'lighting', label: 'controls' },
    ],
  },

  // --- CYBER DOMAIN ---
  'cyber': {
    nodes: [
      { id: 'zerotrust', label: 'Zero Trust', class: 'validation' },
      { id: 'threat', label: 'Threat Hunt', class: 'system' },
      { id: 'phishing', label: 'AI Defense', class: 'tech' },
      { id: 'encryption', label: 'AES-256 Hub', class: 'tech' },
      { id: 'soc', label: 'Ops Center', class: 'domain' },
      { id: 'audit', label: 'Compliance', class: 'validation' },
    ],
    links: [
      { source: 'cyber', target: 'zerotrust', label: 'verifies' },
      { source: 'cyber', target: 'threat', label: 'hunts' },
      { source: 'cyber', target: 'phishing', label: 'blocks' },
      { source: 'cyber', target: 'encryption', label: 'secures' },
      { source: 'cyber', target: 'soc', label: 'manages' },
      { source: 'cyber', target: 'audit', label: 'verifies' },
    ],
  },

  // --- ENERGY DOMAIN ---
  'energy': {
    nodes: [
      { id: 'fusion', label: 'ITER Tokamak', class: 'tech' },
      { id: 'hydrogen', label: 'Green H2', class: 'tech' },
      { id: 'storage_e', label: 'Solid State', class: 'tech' },
      { id: 'microgrid', label: 'Local Distr.', class: 'domain' },
      { id: 'nuclear', label: 'SMR Reactor', class: 'system' },
      { id: 'solar', label: 'Perovskite', class: 'tech' },
    ],
    links: [
      { source: 'energy', target: 'fusion', label: 'generation' },
      { source: 'energy', target: 'hydrogen', label: 'fuel' },
      { source: 'energy', target: 'storage_e', label: 'capacity' },
      { source: 'energy', target: 'microgrid', label: 'distributes' },
      { source: 'energy', target: 'nuclear', label: 'powers' },
      { source: 'energy', target: 'solar', label: 'converts' },
    ],
  },

  // --- DEEP ADS CHAIN (5 LEVELS) ---
  'camera': {
    nodes: [
      { id: 'isp', label: 'ISP Pipeline', class: 'tech' },
      { id: 'optics', label: 'Lens Assembly', class: 'tech' },
    ],
    links: [
      { source: 'camera', target: 'isp', label: 'processes' },
      { source: 'camera', target: 'optics', label: 'refracts' },
    ],
  },
  'isp': {
    nodes: [
      { id: 'buffer', label: 'Frame Buffer', class: 'tech' },
      { id: 'debayer', label: 'Debayer Eng.', class: 'system' },
    ],
    links: [
      { source: 'isp', target: 'buffer', label: 'stores' },
      { source: 'isp', target: 'debayer', label: 'interpolates' },
    ],
  },
  'buffer': {
    nodes: [
      { id: 'stream', label: 'Raw Stream', class: 'domain' },
      { id: 'dma', label: 'DMA Controller', class: 'tech' },
    ],
    links: [
      { source: 'buffer', target: 'stream', label: 'outputs' },
      { source: 'buffer', target: 'dma', label: 'transfers' },
    ],
  },

  // --- DEEP HEALTHCARE CHAIN (5 LEVELS) ---
  'sequencing': {
    nodes: [
      { id: 'analysis', label: 'Variant Analysis', class: 'system' },
      { id: 'basecalls', label: 'Basecall Logs', class: 'tech' },
    ],
    links: [
      { source: 'sequencing', target: 'analysis', label: 'processes' },
      { source: 'sequencing', target: 'basecalls', label: 'logs' },
    ],
  },
  'analysis': {
    nodes: [
      { id: 'variant_v', label: 'SNV Validation', class: 'validation' },
      { id: 'report', label: 'Clinical Report', class: 'domain' },
    ],
    links: [
      { source: 'analysis', target: 'variant_v', label: 'verifies' },
      { source: 'analysis', target: 'report', label: 'generates' },
    ],
  },
  'report': {
    nodes: [
      { id: 'summary', label: 'Exec Summary', class: 'tech' },
      { id: 'signoff', label: 'Dr. Sign-off', class: 'validation' },
    ],
    links: [
      { source: 'report', target: 'summary', label: 'distills' },
      { source: 'report', target: 'signoff', label: 'authorizes' },
    ],
  },

  // --- DEEP FINANCE CHAIN (5 LEVELS) ---
  'contracts': {
    nodes: [
      { id: 'solidity', label: 'Solidity Eng.', class: 'tech' },
      { id: 'gas', label: 'Gas Optimizer', class: 'system' },
    ],
    links: [
      { source: 'contracts', target: 'solidity', label: 'compiles' },
      { source: 'contracts', target: 'gas', label: 'measures' },
    ],
  },
  'gas': {
    nodes: [
      { id: 'estimation', label: 'Fee Estimator', class: 'system' },
      { id: 'limit', label: 'Gas Limit V', class: 'validation' },
    ],
    links: [
      { source: 'gas', target: 'estimation', label: 'predicts' },
      { source: 'gas', target: 'limit', label: 'enforces' },
    ],
  },
  'limit': {
    nodes: [
      { id: 'mempool', label: 'TX Mempool', class: 'domain' },
      { id: 'priority', label: 'Priority Q', class: 'tech' },
    ],
    links: [
      { source: 'limit', target: 'mempool', label: 'submits' },
      { source: 'limit', target: 'priority', label: 'sorts' },
    ],
  },

  // --- DEEP ENERGY CHAIN (5 LEVELS) ---
  'fusion': {
    nodes: [
      { id: 'tokamak', label: 'ITER Vessel', class: 'system' },
      { id: 'magnets', label: 'Superconduct', class: 'tech' },
    ],
    links: [
      { source: 'fusion', target: 'tokamak', label: 'contains' },
      { source: 'fusion', target: 'magnets', label: 'confines' },
    ],
  },
  'tokamak': {
    nodes: [
      { id: 'plasma', label: 'D-T Plasma', class: 'domain' },
      { id: 'blanket', label: 'Lithium Blk', class: 'tech' },
    ],
    links: [
      { source: 'tokamak', target: 'plasma', label: 'heats' },
      { source: 'tokamak', target: 'blanket', label: 'cools' },
    ],
  },
  'plasma': {
    nodes: [
      { id: 'temp', label: 'Temp Sensors', class: 'validation' },
      { id: 'injection', label: 'Pellet Inject', class: 'tech' },
    ],
    links: [
      { source: 'plasma', target: 'temp', label: 'monitors' },
      { source: 'plasma', target: 'injection', label: 'sustains' },
    ],
  },
  'temp': {
    nodes: [
      { id: 'telemetry_f', label: 'Fusion Feed', class: 'tech' },
      { id: 'shutdown', label: 'Safe Shutdown', class: 'validation' },
    ],
    links: [
      { source: 'temp', target: 'telemetry_f', label: 'broadcasts' },
      { source: 'temp', target: 'shutdown', label: 'triggers' },
    ],
  },
  // --- SPACE DEPTH (5 LEVELS) ---
  'mars': {
    nodes: [
      { id: 'habitat_m', label: 'Habitat Alpha', class: 'domain' },
      { id: 'rover', label: 'Survey Rover', class: 'system' },
    ],
    links: [
      { source: 'mars', target: 'habitat_m', label: 'bases' },
      { source: 'mars', target: 'rover', label: 'deploys' },
    ],
  },
  'habitat_m': {
    nodes: [
      { id: 'lifesupport', label: 'Life Support', class: 'system' },
      { id: 'power_m', label: 'Nuclear Kilopw', class: 'tech' },
    ],
    links: [
      { source: 'habitat_m', target: 'lifesupport', label: 'manages' },
      { source: 'habitat_m', target: 'power_m', label: 'powers' },
    ],
  },
  'lifesupport': {
    nodes: [
      { id: 'oxygen', label: 'Oxygen Gen.', class: 'system' },
      { id: 'water_r', label: 'Water Recycle', class: 'tech' },
    ],
    links: [
      { source: 'lifesupport', target: 'oxygen', label: 'produces' },
      { source: 'lifesupport', target: 'water_r', label: 'purifies' },
    ],
  },
  'oxygen': {
    nodes: [
      { id: 'electrolysis', label: 'Electrolysis', class: 'tech' },
      { id: 'o2_sensor', label: 'O2 Purity V', class: 'validation' },
    ],
    links: [
      { source: 'oxygen', target: 'electrolysis', label: 'method' },
      { source: 'oxygen', target: 'o2_sensor', label: 'verifies' },
    ],
  },
  'electrolysis': {
    nodes: [
      { id: 'anode', label: 'Anode Telemetry', class: 'tech' },
      { id: 'voltage_m', label: 'Current Monitor', class: 'validation' },
    ],
    links: [
      { source: 'electrolysis', target: 'anode', label: 'reads' },
      { source: 'electrolysis', target: 'voltage_m', label: 'guards' },
    ],
  },

  // --- QUANTUM DEPTH (5 LEVELS) ---
  'logic': {
    nodes: [
      { id: 'gate_array', label: 'Hadamard Array', class: 'tech' },
      { id: 'error_corr', label: 'Error Correct', class: 'system' },
    ],
    links: [
      { source: 'logic', target: 'gate_array', label: 'executes' },
      { source: 'logic', target: 'error_corr', label: 'stabilizes' },
    ],
  },
  'error_corr': {
    nodes: [
      { id: 'syndrome', label: 'Syndrome Dec.', class: 'system' },
      { id: 'surface', label: 'Surface Code', class: 'tech' },
    ],
    links: [
      { source: 'error_corr', target: 'syndrome', label: 'identifies' },
      { source: 'error_corr', target: 'surface', label: 'encodes' },
    ],
  },
  'syndrome': {
    nodes: [
      { id: 'decode_eng', label: 'Decode Engine', class: 'tech' },
      { id: 'parity_v', label: 'Parity Verify', class: 'validation' },
    ],
    links: [
      { source: 'syndrome', target: 'decode_eng', label: 'processes' },
      { source: 'syndrome', target: 'parity_v', label: 'validates' },
    ],
  },
  'decode_eng': {
    nodes: [
      { id: 'buffer_q', label: 'Quantum Buffer', class: 'tech' },
      { id: 'latency_m', label: 'Latency Mon.', class: 'validation' },
    ],
    links: [
      { source: 'decode_eng', target: 'buffer_q', label: 'buffers' },
      { source: 'decode_eng', target: 'latency_m', label: 'monitors' },
    ],
  },

  // --- ROBOTICS DEPTH (5 LEVELS) ---
  'vision': {
    nodes: [
      { id: 'depth_m', label: 'Depth Mapping', class: 'system' },
      { id: 'object_r', label: 'Object Recog.', class: 'system' },
    ],
    links: [
      { source: 'vision', target: 'depth_m', label: 'perceives' },
      { source: 'vision', target: 'object_r', label: 'identifies' },
    ],
  },
  'object_r': {
    nodes: [
      { id: 'neural_net', label: 'Inference Net', class: 'tech' },
      { id: 'feature_e', label: 'Feature Extr.', class: 'system' },
    ],
    links: [
      { source: 'object_r', target: 'neural_net', label: 'runs' },
      { source: 'object_r', target: 'feature_e', label: 'extracts' },
    ],
  },
  'neural_net': {
    nodes: [
      { id: 'weights', label: 'Weight Data', class: 'domain' },
      { id: 'layers', label: 'Layer Config', class: 'tech' },
    ],
    links: [
      { source: 'neural_net', target: 'weights', label: 'loads' },
      { source: 'neural_net', target: 'layers', label: 'defines' },
    ],
  },
  'weights': {
    nodes: [
      { id: 'tensor_f', label: 'Tensor Flow', class: 'tech' },
      { id: 'gradient_v', label: 'Gradient V.', class: 'validation' },
    ],
    links: [
      { source: 'weights', target: 'tensor_f', label: 'streams' },
      { source: 'weights', target: 'gradient_v', label: 'checks' },
    ],
  },

  // --- CLIMATE DEPTH (5 LEVELS) ---
  'oceans': {
    nodes: [
      { id: 'ph_sensor', label: 'PH Monitor', class: 'system' },
      { id: 'currents', label: 'Thermal Flow', class: 'domain' },
    ],
    links: [
      { source: 'oceans', target: 'ph_sensor', label: 'samples' },
      { source: 'oceans', target: 'currents', label: 'tracks' },
    ],
  },
  'ph_sensor': {
    nodes: [
      { id: 'transducer', label: 'Ion Transduc.', class: 'tech' },
      { id: 'calibration', label: 'Auto-Calibrate', class: 'validation' },
    ],
    links: [
      { source: 'ph_sensor', target: 'transducer', label: 'senses' },
      { source: 'ph_sensor', target: 'calibration', label: 'verifies' },
    ],
  },
  'transducer': {
    nodes: [
      { id: 'analog_f', label: 'Analog Signal', class: 'tech' },
      { id: 'adc_conv', label: 'ADC Converter', class: 'system' },
    ],
    links: [
      { source: 'transducer', target: 'analog_f', label: 'outputs' },
      { source: 'transducer', target: 'adc_conv', label: 'discretizes' },
    ],
  },
  'adc_conv': {
    nodes: [
      { id: 'bitstream', label: 'Bitstream Hub', class: 'tech' },
      { id: 'sampling_v', label: 'Sample Rate V', class: 'validation' },
    ],
    links: [
      { source: 'adc_conv', target: 'bitstream', label: 'encodes' },
      { source: 'adc_conv', target: 'sampling_v', label: 'guards' },
    ],
  }
};

// --- Mock API Helpers ---

export const getAllNodeIds = () => {
  const ids = new Set<string>();
  Object.values(FULL_GRAPH).forEach(res => {
    res.nodes.forEach(n => ids.add(n.id));
  });
  // Also include the perspective keys themselves
  Object.keys(FULL_GRAPH).forEach(k => ids.add(k));
  return Array.from(ids).sort();
};

export const getNodeLabel = (id: string) => {
  for (const res of Object.values(FULL_GRAPH)) {
    const n = res.nodes.find(node => node.id === id);
    if (n) return n.label;
  }
  return id;
};

export async function fetchNeighbors(nodeId: string): Promise<NeighborResult> {
  const delay = 300 + Math.random() * 200;
  return new Promise((resolve) => setTimeout(() => {
    resolve(FULL_GRAPH[nodeId] || { nodes: [], links: [] });
  }, delay));
}

export const ROOT_NODE: KGNode = { id: 'ads', label: 'Autonomous Driving', class: 'root' };

export async function getGraphStats() {
  const allNodes = new Set<string>();
  const allLinks = new Set<string>();
  Object.entries(FULL_GRAPH).forEach(([parent, res]) => {
    allNodes.add(parent);
    res.nodes.forEach(n => allNodes.add(n.id));
    res.links.forEach(l => { allLinks.add([l.source, l.target].sort().join('--')); });
  });
  return { nodeCount: allNodes.size, edgeCount: allLinks.size };
}

export interface NodeDetail {
  id: string; label: string; class: NodeClass; description: string;
  telemetry: { label: string; value: string }[];
}

export async function fetchNodeDetail(nodeId: string): Promise<NodeDetail> {
  const delay = 600 + Math.random() * 400;
  return new Promise((resolve) => setTimeout(() => {
    const label = nodeId.charAt(0).toUpperCase() + nodeId.slice(1);
    resolve({
      id: nodeId, label, class: 'tech',
      description: `Semantic core for ${label}. Optimized for high-throughput reasoning and research integrity.`,
      telemetry: [
        { label: 'Semantic Weight', value: (Math.random() * 0.9 + 0.1).toFixed(3) },
        { label: 'Global Rank', value: `#${Math.floor(Math.random() * 100)}` },
        { label: 'Uptime', value: '99.98%' },
        { label: 'Last Sync', value: new Date().toLocaleTimeString() },
      ]
    });
  }, delay));
}

export async function searchNodes(query: string): Promise<KGNode[]> {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const allNodes = new Map<string, KGNode>();
  // Include defined roots
  const roots = ['ads', 'healthcare', 'finance', 'space', 'quantum', 'robotics', 'climate', 'bio', 'smartcity', 'cyber', 'energy'];
  roots.forEach(r => allNodes.set(r, { id: r, label: r.charAt(0).toUpperCase() + r.slice(1), class: 'root' }));

  Object.values(FULL_GRAPH).forEach(res => {
    res.nodes.forEach(n => allNodes.set(n.id, n));
  });
  return Array.from(allNodes.values()).filter(n => n.label.toLowerCase().includes(q)).slice(0, 8);
}

export async function getNodeById(id: string): Promise<KGNode | null> {
  const roots: Record<string, string> = {
    ads: 'Autonomous Driving', healthcare: 'Healthcare', finance: 'Finance', space: 'Space',
    quantum: 'Quantum', robotics: 'Robotics', climate: 'Climate', bio: 'Bio',
    smartcity: 'Smart City', cyber: 'Cyber', energy: 'Energy'
  };
  if (roots[id]) return { id, label: roots[id], class: 'root' };
  for (const res of Object.values(FULL_GRAPH)) {
    const found = res.nodes.find(n => n.id === id);
    if (found) return found;
  }
  return null;
}

export async function getParentInfo(id: string): Promise<{ node: KGNode, link: any } | null> {
  for (const [parentId, res] of Object.entries(FULL_GRAPH)) {
    const child = res.nodes.find(n => n.id === id);
    if (child) {
      const parentNode = await getNodeById(parentId);
      const link = res.links.find(l => l.target === id);
      if (parentNode && link) return { node: parentNode, link };
    }
  }
  return null;
}
