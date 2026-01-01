<script>
    import Info from '../../components/Info.svelte';

    const taaLinks = [{text: "Wikipedia", url: "https://en.wikipedia.org/wiki/Timing_attack"},
    {text: "Synopsys", url: "https://www.synopsys.com/glossary/what-is-static-timing-analysis.html"},
    {text: "Advanced Digital Systems Design", url: "https://schaumont.dyn.wpi.edu/ece574f23/06timing.html"}
    ];
</script>

<Info title="About Timing Analysis Attack" links={taaLinks}>

    <b>Timing analysis</b> (a side-channel attack) is the process of evaluating the time required for different 
    cryptographic algorithms (or operations/events) in a system. Information can leak from a system through measurement of 
    the time it takes to respond to certain queries. It is commonly used in various fields, including: 
    <ul>
    <li><b>Digital Circuit Design (Static Timing Analysis - STA)</b>: Ensures a circuit meets timing constraints (setup and hold times).</li>
    <li><b>Embedded Systems & Real-Time Systems:</b> Includes <b>Worst-Case Execution Time (WCET)</b> analysis.</li>
    <li><b>Performance Analysis in Software & Algorithms:</b> Used for optimization (e.g., Big-O analysis, profiling).</li>
    <li><b>Mechanical & Physical Systems:</b> Used in robotics and automation to ensure precise timing.</li>
    </ul>

</Info>