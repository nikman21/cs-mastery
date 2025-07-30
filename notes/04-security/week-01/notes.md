# Week 1 Notes

## By Nikolas Manuel

### Threat Modeling OWASP

- A threat model is essentially a strucutured representation of all the information that affects the security of an app;ication.

- Threat modeling is a process for capturing, organizing and analyzing all of this information.

- A threat is a potential or actual undesirable event  that may be malicious.

- Threat modeling is a planned activity for identifying and assessing application threats and vulnerabilities.

#### Threat Modeling - Four Question Framework

- For a threat to an application to exist, there must be a combination of the following where the combined likelihood and impact are important enough to do something about. Following is the four question framework that helps organize threat modeling:
    1. What are we working on?
    2. What can go wrong?
    3. What are we going to do about it?
    4. Did we do a good job?
- Assessment Scope - The first step is to ask what are we working on? This might be as small as a sprint, or as large as a whole system.

- Identify what can go wrong - This can be as simple as a brainstorm, or as structured as using STRIDE, Kill Chains, or Attack Trees.

- Identify countermeasures or manage risk - Decide what you’re going to do about each threat. That might be to implement a mitigation, or to apply the accept/transfer/eliminate approaches of risk management.

- Assess your work - Did you do a good enough job for the system at hand?

### Applying the Threat Model

#### What

Most of the time a threat model includeds:

- A description / design / model of what you’re worried about
- A list of assumptions that can be checked or challenged in the future as the threat landscape changes
- A list of potential threats to the system
- A list of actions to be taken for each threat
- A way of validating the model and threats, and verification of success of actions taken.

The sooner the better but never too late.

#### Why

The inclusion of threat modeling in the SDLC can help

- Build a secure design
- Efficient investment of resources; appropriately - prioritize security, development, and other tasks
- Bring Security and Development together to collaborate on a shared understanding, informing development of the system
- Identify threats and compliance requirements, and evaluate their risk
- Define and build required controls.
- Balance risks, controls, and usability
- Identify where building a control is unnecessary, based on acceptable risk
- Document threats and mitigation
- Ensure business requirements (or goals) are adequately protected in the face of a malicious actor, accidents, or other causes of impact
- Identification of security test cases / security test scenarios to test the security requirements.

## MIT OpenCourse

### Introduction Threat Models

- Security is Goal vs Adversery
    1. Policies -> confidentelity, intergrity, and availability
    2. Threat model -> assumptions about adversery
    3. Mechanism -> software/hardware/sys
