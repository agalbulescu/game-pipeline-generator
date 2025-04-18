const defaultGames = [
    { displayName: 'Andar Bahar', internalName: 'andar_bahar' },
    { displayName: 'Automated Roulette', internalName: 'automated_roulette' },
    { displayName: 'Baccarat', internalName: 'baccarat' },
    { displayName: 'Baccarat Dragon Tiger', internalName: 'baccarat_dragon_tiger' },
    { displayName: 'Baccarat Knockout', internalName: 'baccarat_knockout' },
    { displayName: 'Baccarat No Commission', internalName: 'baccarat_no_commission' },
    { displayName: 'Baccarat Super Six', internalName: 'baccarat_super_six' },
    { displayName: 'Bet on Teen Patti', internalName: 'bet_on_teen_patti' },
    { displayName: 'Blackjack', internalName: 'blackjack' },
    { displayName: 'Blackjack Salon Privé', internalName: 'blackjack_salon_prive' },
    { displayName: 'Casino Hold\'em', internalName: 'casino_holdem' },
    { displayName: 'Cricket War', internalName: 'cricket_war' },
    { displayName: 'Lucky Seven', internalName: 'lucky_seven' },
    { displayName: 'Matka', internalName: 'matka' },
    { displayName: 'One Day Teen Patti Back & Lay', internalName: 'one_day_teen_patti_back_and_lay' },
    { displayName: 'OTT Andar Bahar', internalName: 'ott_andar_bahar' },
    { displayName: 'OTT Baccarat', internalName: 'ott_baccarat' },
    { displayName: 'OTT Roulette', internalName: 'ott_roulette' },
    { displayName: 'Roulette', internalName: 'roulette' },
    { displayName: 'Roulette New', internalName: 'roulette_new' },
    { displayName: 'Russian Poker', internalName: 'russian_poker' },
    { displayName: 'Sic Bo', internalName: 'sic_bo' },
    { displayName: 'Teen Patti', internalName: 'teen_patti' },
    { displayName: 'Thirty-Two Cards', internalName: 'thirty_two_cards' },
    { displayName: 'Ultimate Andar Bahar', internalName: 'ultimate_andar_bahar' },
    { displayName: 'Ultimate Roulette', internalName: 'ultimate_roulette' },
    { displayName: 'Ultimate Sic Bo', internalName: 'ultimate_sic_bo' },
    { displayName: 'Unlimited Blackjack', internalName: 'unlimited_blackjack' },
    { displayName: 'Xóc Đĩa', internalName: 'xoc_dia' }
];

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    defaultGames.forEach(game => {
        addGameEntry(game.displayName, game.internalName);
    });
    updateTable();
});

// Function to add a new game entry
function addGameEntry(displayName = '', internalName = '') {
    const container = document.getElementById('games-list-container');
    const entry = document.createElement('div');
    entry.classList.add('game-entry');
    entry.innerHTML = `
        <input type="text" class="display-name" placeholder="Display Name" value="${displayName}">
        <input type="text" class="internal-name" placeholder="Internal Name" value="${internalName}">
        <button onclick="removeGameEntry(this)">✖</button>
    `;
    container.appendChild(entry);
}

// Function to remove a game entry
function removeGameEntry(button) {
    const entry = button.closest('.game-entry');
    entry.remove();
}

// Function to save the games list and update the table
function saveGamesList() {
    updateTable(); // Update the table with the current games list
    toggleEditGames(); // Hide the edit games window and revert the UI state
    // const editGames = document.getElementById('edit-games');
    // editGames.style.display = 'none'; // Hide the edit games window
}

// Function to toggle light/dark mode
function toggleMode() {
    const body = document.body;
    body.classList.toggle('light-mode');
    document.querySelector('header').classList.toggle('light-mode');
    document.querySelector('.sub-title').classList.toggle('light-mode');
    document.querySelector('.sub-title-2').classList.toggle('light-mode');
    document.querySelector('.buttons-container').classList.toggle('light-mode');
    document.querySelector('.textbox-container').classList.toggle('light-mode');
    document.querySelector('table').classList.toggle('light-mode');
    document.querySelector('#edit-games').classList.toggle('light-mode');
}

function toggleButton(button) {
    const buttons = document.querySelectorAll('.buttons-container button');
    const payoutsButton = document.querySelector('.buttons-container button:nth-child(2)');
    const uiButton = document.querySelector('.buttons-container button:nth-child(3)');
    const analyticsButton = document.querySelector('.buttons-container button:nth-child(4)');
    const smappButton = document.querySelector('.buttons-container button:nth-child(5)');
    const desktopButton = document.querySelector('.buttons-container button:nth-child(6)');
    const mobileButton = document.querySelector('.buttons-container button:nth-child(7)');

    // Toggle the clicked button
    button.classList.toggle('active');

    // Handle DESKTOP and SMAPP relationship
    if (button === desktopButton) {
        if (desktopButton.classList.contains('active')) {
            // If DESKTOP is activated, activate SMAPP as well
            smappButton.classList.add('active');
        } else {
            // If DESKTOP is deactivated, deactivate SMAPP as well
            smappButton.classList.remove('active');
        }
    }

    // If SMAPP is clicked independently, ensure DESKTOP is not automatically activated
    if (button === smappButton && desktopButton.classList.contains('active')) {
        // If DESKTOP is active, SMAPP cannot be deactivated
        smappButton.classList.add('active');
    }

    // If the clicked button is PAYOUTS, UI, or ANALYTICS
    if (button === payoutsButton || button === uiButton || button === analyticsButton) {
        // Deactivate DESKTOP and MOBILE
        desktopButton.classList.remove('active');
        mobileButton.classList.remove('active');
    }

    // If the clicked button is DESKTOP or MOBILE
    if (button === desktopButton || button === mobileButton) {
        // Deactivate PAYOUTS, UI, and ANALYTICS
        payoutsButton.classList.remove('active');
        uiButton.classList.remove('active');
        analyticsButton.classList.remove('active');
    }

    // Handle ALL button logic
    if (button.textContent === 'ALL') {
        buttons.forEach(btn => {
            if (btn !== button && btn.textContent !== 'CLEAR') {
                btn.classList.remove('active');
            }
        });
    } else if (button.textContent !== 'CLEAR') {
        document.querySelector('.buttons-container button:first-child').classList.remove('active');
    }

    // Update the table and output
    updateTableBasedOnButtons();
    updateOutput();
}

// Function to clear all active buttons
function clearButtons() {
    const buttons = document.querySelectorAll('.buttons-container button');
    buttons.forEach(button => button.classList.remove('active'));
    updateTableBasedOnButtons();
    updateOutput();
}

// Function to toggle the edit games window
function toggleEditGames() {
    const editGames = document.getElementById('edit-games');
    const table = document.querySelector('table');
    const subTitle = document.querySelector('.sub-title');
    const subTitle2 = document.querySelector('.sub-title-2');
    const buttonsContainer = document.querySelector('.buttons-container');
    const textboxContainer = document.querySelector('.textbox-container');
    const editGamesButton = document.getElementById('edit-games-button');

    if (editGames.style.display === 'none' || editGames.style.display === '') {
        editGames.style.display = 'block'; // Show the edit games window
        table.style.display = 'none'; // Hide the table
        subTitle.style.display = 'none'; // Hide the sub-title
        subTitle2.style.display = 'none'; // Hide the sub-title-2
        buttonsContainer.style.display = 'none'; // Hide the buttons-container
        textboxContainer.style.display = 'none'; // Hide the textbox-container
        editGamesButton.classList.add('active'); // Add active class to the button
    } else {
        editGames.style.display = 'none'; // Hide the edit games window
        table.style.display = 'table'; // Show the table
        subTitle.style.display = 'block'; // Show the sub-title
        subTitle2.style.display = 'block'; // Show the sub-title-2
        buttonsContainer.style.display = 'flex'; // Show the buttons-container
        textboxContainer.style.display = 'flex'; // Show the textbox-container
        editGamesButton.classList.remove('active'); // Remove active class from the button
    }

    // Initialize the form with existing games (if any)
    if (editGames.style.display === 'block') {
        const tableBody = document.getElementById('table-body');
        const rows = tableBody.querySelectorAll('tr');
        const container = document.getElementById('games-list-container');
        container.innerHTML = ''; // Clear existing entries
        rows.forEach(row => {
            const displayName = row.querySelector('td:nth-child(2)').textContent;
            const internalName = row.dataset.internalName;
            addGameEntry(displayName, internalName);
        });
    }
}

// Function to update the table based on the games list
function updateTable() {
    const container = document.getElementById('games-list-container');
    const entries = container.querySelectorAll('.game-entry');
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';

    entries.forEach(entry => {
        const displayName = entry.querySelector('.display-name').value.trim();
        const internalName = entry.querySelector('.internal-name').value.trim();
        if (!displayName || !internalName) return; // Skip invalid entries

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <label class="switch">
                    <input type="checkbox" onchange="toggleRowSwitches(this)">
                    <span class="slider round"></span>
                </label>
            </td>
            <td class="game-name-cell">${displayName}</td>
            <td>
                <label class="switch">
                    <input type="checkbox" class="all-switch" disabled onchange="toggleAllSwitch(this)" data-column="all">
                    <span class="slider round"></span>
                </label>
            </td>
            <td>
                <label class="switch">
                    <input type="checkbox" class="payouts-switch" disabled onchange="togglePayoutsSwitch(this)" data-column="payouts">
                    <span class="slider round"></span>
                </label>
            </td>
            <td>
                <label class="switch">
                    <input type="checkbox" class="ui-switch" disabled onchange="toggleUISwitch(this)" data-column="ui">
                    <span class="slider round"></span>
                </label>
            </td>
            <td>
                <label class="switch">
                    <input type="checkbox" class="analytics-switch" disabled onchange="toggleAnalyticsSwitch(this)" data-column="analytics">
                    <span class="slider round"></span>
                </label>
            </td>
            <td>
                <label class="switch">
                    <input type="checkbox" class="smapp-switch" disabled onchange="toggleSMAppSwitch(this)" data-column="smapp">
                    <span class="slider round"></span>
                </label>
            </td>
            <td>
                <label class="switch">
                    <input type="checkbox" class="desktop-payouts-switch" disabled onchange="toggleDesktopPayoutsSwitch(this)" data-column="desktop_payouts">
                    <span class="slider round"></span>
                </label>
            </td>
            <td>
                <label class="switch">
                    <input type="checkbox" class="desktop-ui-switch" disabled onchange="toggleDesktopUISwitch(this)" data-column="desktop_ui">
                    <span class="slider round"></span>
                </label>
            </td>
            <td>
                <label class="switch">
                    <input type="checkbox" class="desktop-analytics-switch" disabled onchange="toggleDesktopAnalyticsSwitch(this)" data-column="desktop_analytics">
                    <span class="slider round"></span>
                </label>
            </td>
            <td>
                <label class="switch">
                    <input type="checkbox" class="mobile-payouts-switch" disabled onchange="toggleMobilePayoutsSwitch(this)" data-column="mobile_payouts">
                    <span class="slider round"></span>
                </label>
            </td>
            <td>
                <label class="switch">
                    <input type="checkbox" class="mobile-ui-switch" disabled onchange="toggleMobileUISwitch(this)" data-column="mobile_ui">
                    <span class="slider round"></span>
                </label>
            </td>
            <td>
                <label class="switch">
                    <input type="checkbox" class="mobile-analytics-switch" disabled onchange="toggleMobileAnalyticsSwitch(this)" data-column="mobile_analytics">
                    <span class="slider round"></span>
                </label>
            </td>
        `;
        row.dataset.internalName = internalName; // Store internal name in the row
        tableBody.appendChild(row);
    });

    // Add click event listeners to table cells to toggle switches
    const tableCells = document.querySelectorAll('#table-body td');
    tableCells.forEach(cell => {
        cell.addEventListener('click', (event) => {
            const switchInput = cell.querySelector('input[type="checkbox"]');
            if (switchInput && !switchInput.disabled) { // Only toggle if not disabled
                switchInput.checked = !switchInput.checked;
                switchInput.dispatchEvent(new Event('change'));
            }
        });
    });

    updateTableBasedOnButtons();
}

// Function to update the table based on the active buttons
function updateTableBasedOnButtons() {
    const rows = document.querySelectorAll('#table-body tr');
    const allButton = document.querySelector('.buttons-container button:first-child');
    const payoutsButton = document.querySelector('.buttons-container button:nth-child(2)');
    const uiButton = document.querySelector('.buttons-container button:nth-child(3)');
    const analyticsButton = document.querySelector('.buttons-container button:nth-child(4)');
    const smappButton = document.querySelector('.buttons-container button:nth-child(5)');
    const desktopButton = document.querySelector('.buttons-container button:nth-child(6)');
    const mobileButton = document.querySelector('.buttons-container button:nth-child(7)');

    rows.forEach(row => {
        const runSwitch = row.querySelector('input[type="checkbox"]:first-child');
        const allSwitch = row.querySelector('.all-switch');
        const payoutsSwitch = row.querySelector('.payouts-switch');
        const uiSwitch = row.querySelector('.ui-switch');
        const analyticsSwitch = row.querySelector('.analytics-switch');
        const smappSwitch = row.querySelector('.smapp-switch');
        const desktopPayoutsSwitch = row.querySelector('.desktop-payouts-switch');
        const desktopUISwitch = row.querySelector('.desktop-ui-switch');
        const desktopAnalyticsSwitch = row.querySelector('.desktop-analytics-switch');
        const mobilePayoutsSwitch = row.querySelector('.mobile-payouts-switch');
        const mobileUISwitch = row.querySelector('.mobile-ui-switch');
        const mobileAnalyticsSwitch = row.querySelector('.mobile-analytics-switch');

        // Reset all switches
        runSwitch.checked = false;
        allSwitch.checked = false;
        payoutsSwitch.checked = false;
        uiSwitch.checked = false;
        analyticsSwitch.checked = false;
        smappSwitch.checked = false;
        desktopPayoutsSwitch.checked = false;
        desktopUISwitch.checked = false;
        desktopAnalyticsSwitch.checked = false;
        mobilePayoutsSwitch.checked = false;
        mobileUISwitch.checked = false;
        mobileAnalyticsSwitch.checked = false;

        // Enable/disable switches based on button state
        if (allButton.classList.contains('active') ||
            payoutsButton.classList.contains('active') ||
            uiButton.classList.contains('active') ||
            analyticsButton.classList.contains('active') ||
            smappButton.classList.contains('active') ||
            desktopButton.classList.contains('active') ||
            mobileButton.classList.contains('active')) {
            runSwitch.checked = true;
            runSwitch.disabled = false;
            row.classList.add('selected-row'); // Add highlight
            const switches = row.querySelectorAll('input[type="checkbox"]');
            switches.forEach(switchInput => {
                if (switchInput !== runSwitch) {
                    switchInput.disabled = false;
                }
            });

            if (allButton.classList.contains('active')) {
                allSwitch.checked = true;
                toggleAllSwitch(allSwitch);
            }

            if (payoutsButton.classList.contains('active')) {
                payoutsSwitch.checked = true;
                togglePayoutsSwitch(payoutsSwitch);
            }

            if (uiButton.classList.contains('active')) {
                uiSwitch.checked = true;
                toggleUISwitch(uiSwitch);
            }

            if (analyticsButton.classList.contains('active')) {
                analyticsSwitch.checked = true;
                toggleAnalyticsSwitch(analyticsSwitch);
            }

            if (smappButton.classList.contains('active')) {
                smappSwitch.checked = true;
                toggleSMAppSwitch(smappSwitch);
            }

            if (desktopButton.classList.contains('active')) {
                desktopPayoutsSwitch.checked = true;
                desktopUISwitch.checked = true;
                desktopAnalyticsSwitch.checked = true;
                smappSwitch.checked = true; // Ensure SMAPP is checked when DESKTOP is active
                toggleDesktopPayoutsSwitch(desktopPayoutsSwitch);
                toggleDesktopUISwitch(desktopUISwitch);
                toggleDesktopAnalyticsSwitch(desktopAnalyticsSwitch);
                toggleSMAppSwitch(smappSwitch);
            }

            if (mobileButton.classList.contains('active')) {
                mobilePayoutsSwitch.checked = true;
                mobileUISwitch.checked = true;
                mobileAnalyticsSwitch.checked = true;
                toggleMobilePayoutsSwitch(mobilePayoutsSwitch);
                toggleMobileUISwitch(mobileUISwitch);
                toggleMobileAnalyticsSwitch(mobileAnalyticsSwitch);
            }
        } else {
            runSwitch.checked = false;
            runSwitch.disabled = false;
            row.classList.remove('selected-row'); // Remove highlight
            const switches = row.querySelectorAll('input[type="checkbox"]');
            switches.forEach(switchInput => {
                if (switchInput !== runSwitch) {
                    switchInput.disabled = true;
                    switchInput.checked = false; // Ensure toggles are off when RUN is off
                }
            });
        }
    });
}

// Function to enable/disable switches in a row based on the "RUN" switch
function toggleRowSwitches(runSwitch) {
    const row = runSwitch.closest('tr');
    const switches = row.querySelectorAll('input[type="checkbox"]');
    switches.forEach(switchInput => {
        if (switchInput !== runSwitch) {
            switchInput.disabled = !runSwitch.checked;
            if (!runSwitch.checked) {
                switchInput.checked = false; // Ensure toggles are off when RUN is off
            }
        }
    });

    // Activate the "All" toggle by default when RUN is toggled on
    if (runSwitch.checked) {
        const allSwitch = row.querySelector('.all-switch');
        if (allSwitch) {
            allSwitch.checked = true;
            toggleAllSwitch(allSwitch); // Ensure "All" toggle logic is applied
        }
        row.classList.add('selected-row'); // Add highlight
    } else {
        row.classList.remove('selected-row'); // Remove highlight
    }
    updateOutput();
}

// Function to handle "All" switch logic
function toggleAllSwitch(allSwitch) {
    const row = allSwitch.closest('tr');
    const payoutsSwitch = row.querySelector('.payouts-switch');
    const uiSwitch = row.querySelector('.ui-switch');
    const analyticsSwitch = row.querySelector('.analytics-switch');
    const smappSwitch = row.querySelector('.smapp-switch');
    const desktopPayoutsSwitch = row.querySelector('.desktop-payouts-switch');
    const desktopUISwitch = row.querySelector('.desktop-ui-switch');
    const desktopAnalyticsSwitch = row.querySelector('.desktop-analytics-switch');
    const mobilePayoutsSwitch = row.querySelector('.mobile-payouts-switch');
    const mobileUISwitch = row.querySelector('.mobile-ui-switch');
    const mobileAnalyticsSwitch = row.querySelector('.mobile-analytics-switch');

    if (allSwitch.checked) {
        payoutsSwitch.checked = false;
        uiSwitch.checked = false;
        analyticsSwitch.checked = false;
        smappSwitch.checked = false;
        desktopPayoutsSwitch.checked = false;
        desktopUISwitch.checked = false;
        desktopAnalyticsSwitch.checked = false;
        mobilePayoutsSwitch.checked = false;
        mobileUISwitch.checked = false;
        mobileAnalyticsSwitch.checked = false;
    }
    updateOutput();
}

// Function to handle "Payouts" switch logic
function togglePayoutsSwitch(payoutsSwitch) {
    const row = payoutsSwitch.closest('tr');
    const allSwitch = row.querySelector('.all-switch');
    const desktopPayoutsSwitch = row.querySelector('.desktop-payouts-switch');
    const mobilePayoutsSwitch = row.querySelector('.mobile-payouts-switch');

    if (payoutsSwitch.checked) {
        allSwitch.checked = false;
        desktopPayoutsSwitch.checked = false;
        mobilePayoutsSwitch.checked = false;
    } else if (desktopPayoutsSwitch.checked || mobilePayoutsSwitch.checked) {
        payoutsSwitch.checked = false;
    }
    updateOutput();
}

// Function to handle "UI" switch logic
function toggleUISwitch(uiSwitch) {
    const row = uiSwitch.closest('tr');
    const allSwitch = row.querySelector('.all-switch');
    const desktopUISwitch = row.querySelector('.desktop-ui-switch');
    const mobileUISwitch = row.querySelector('.mobile-ui-switch');

    if (uiSwitch.checked) {
        allSwitch.checked = false;
        desktopUISwitch.checked = false;
        mobileUISwitch.checked = false;
    } else if (desktopUISwitch.checked || mobileUISwitch.checked) {
        uiSwitch.checked = false;
    }
    updateOutput();
}

// Function to handle "Analytics" switch logic
function toggleAnalyticsSwitch(analyticsSwitch) {
    const row = analyticsSwitch.closest('tr');
    const allSwitch = row.querySelector('.all-switch');
    const desktopAnalyticsSwitch = row.querySelector('.desktop-analytics-switch');
    const mobileAnalyticsSwitch = row.querySelector('.mobile-analytics-switch');

    if (analyticsSwitch.checked) {
        allSwitch.checked = false;
        desktopAnalyticsSwitch.checked = false;
        mobileAnalyticsSwitch.checked = false;
    } else if (desktopAnalyticsSwitch.checked || mobileAnalyticsSwitch.checked) {
        analyticsSwitch.checked = false;
    }
    updateOutput();
}

// Function to handle "SMApp" switch logic
function toggleSMAppSwitch(smappSwitch) {
    const row = smappSwitch.closest('tr');
    const allSwitch = row.querySelector('.all-switch');
    if (smappSwitch.checked) {
        allSwitch.checked = false;
    }
    updateOutput();
}

// Function to handle "Desktop Payouts" switch logic
function toggleDesktopPayoutsSwitch(desktopPayoutsSwitch) {
    const row = desktopPayoutsSwitch.closest('tr');
    const allSwitch = row.querySelector('.all-switch');
    const payoutsSwitch = row.querySelector('.payouts-switch');
    if (desktopPayoutsSwitch.checked) {
        allSwitch.checked = false;
        payoutsSwitch.checked = false;
    }
    updateOutput();
}

// Function to handle "Mobile Payouts" switch logic
function toggleMobilePayoutsSwitch(mobilePayoutsSwitch) {
    const row = mobilePayoutsSwitch.closest('tr');
    const allSwitch = row.querySelector('.all-switch');
    const payoutsSwitch = row.querySelector('.payouts-switch');
    if (mobilePayoutsSwitch.checked) {
        allSwitch.checked = false;
        payoutsSwitch.checked = false;
    }
    updateOutput();
}

// Function to handle "Desktop UI" switch logic
function toggleDesktopUISwitch(desktopUISwitch) {
    const row = desktopUISwitch.closest('tr');
    const allSwitch = row.querySelector('.all-switch');
    const uiSwitch = row.querySelector('.ui-switch');
    if (desktopUISwitch.checked) {
        allSwitch.checked = false;
        uiSwitch.checked = false;
    }
    updateOutput();
}

// Function to handle "Mobile UI" switch logic
function toggleMobileUISwitch(mobileUISwitch) {
    const row = mobileUISwitch.closest('tr');
    const allSwitch = row.querySelector('.all-switch');
    const uiSwitch = row.querySelector('.ui-switch');
    if (mobileUISwitch.checked) {
        allSwitch.checked = false;
        uiSwitch.checked = false;
    }
    updateOutput();
}

// Function to handle "Desktop Analytics" switch logic
function toggleDesktopAnalyticsSwitch(desktopAnalyticsSwitch) {
    const row = desktopAnalyticsSwitch.closest('tr');
    const allSwitch = row.querySelector('.all-switch');
    const analyticsSwitch = row.querySelector('.analytics-switch');
    if (desktopAnalyticsSwitch.checked) {
        allSwitch.checked = false;
        analyticsSwitch.checked = false;
    }
    updateOutput();
}

// Function to handle "Mobile Analytics" switch logic
function toggleMobileAnalyticsSwitch(mobileAnalyticsSwitch) {
    const row = mobileAnalyticsSwitch.closest('tr');
    const allSwitch = row.querySelector('.all-switch');
    const analyticsSwitch = row.querySelector('.analytics-switch');
    if (mobileAnalyticsSwitch.checked) {
        allSwitch.checked = false;
        analyticsSwitch.checked = false;
    }
    updateOutput();
}

// Function to update the output textbox
function updateOutput() {
    const outputText = document.getElementById('output-text');
    const rows = document.querySelectorAll('#table-body tr');
    let output = '';

    rows.forEach(row => {
        const runSwitch = row.querySelector('input[type="checkbox"]:first-child');
        if (runSwitch.checked) {
            const internalName = row.dataset.internalName; // Use internal name
            const allSwitch = row.querySelector('.all-switch');
            const selectedColumns = [];

            if (allSwitch.checked) {
                selectedColumns.push('all');
            } else {
                const switches = row.querySelectorAll('input[type="checkbox"]:checked');
                switches.forEach(switchInput => {
                    if (switchInput !== runSwitch && switchInput !== allSwitch) {
                        const columnName = switchInput.getAttribute('data-column');
                        selectedColumns.push(columnName);
                    }
                });

                // Check for optimizations
                const hasAllDesktop = selectedColumns.includes('smapp') &&
                                     selectedColumns.includes('desktop_payouts') &&
                                     selectedColumns.includes('desktop_ui') &&
                                     selectedColumns.includes('desktop_analytics');

                const hasAllMobile = selectedColumns.includes('mobile_payouts') &&
                                    selectedColumns.includes('mobile_ui') &&
                                    selectedColumns.includes('mobile_analytics');

                const hasAllColumns = hasAllDesktop && hasAllMobile;

                const hasPayoutsUiAnalyticsSmapp = selectedColumns.includes('payouts') &&
                                                  selectedColumns.includes('ui') &&
                                                  selectedColumns.includes('analytics') &&
                                                  selectedColumns.includes('smapp');

                if (hasAllColumns) {
                    // If all columns are checked, replace with "all"
                    selectedColumns.length = 0; // Clear the array
                    selectedColumns.push('all');
                } else if (hasPayoutsUiAnalyticsSmapp) {
                    // If payouts, ui, analytics, and smapp are checked, replace with "all"
                    selectedColumns.length = 0; // Clear the array
                    selectedColumns.push('all');
                } else {
                    // Handle desktop and mobile optimizations independently
                    if (hasAllDesktop) {
                        // Remove individual desktop columns and add "desktop"
                        selectedColumns.splice(selectedColumns.indexOf('smapp'), 1);
                        selectedColumns.splice(selectedColumns.indexOf('desktop_payouts'), 1);
                        selectedColumns.splice(selectedColumns.indexOf('desktop_ui'), 1);
                        selectedColumns.splice(selectedColumns.indexOf('desktop_analytics'), 1);
                        selectedColumns.push('desktop');
                    }

                    if (hasAllMobile) {
                        // Remove individual mobile columns and add "mobile"
                        selectedColumns.splice(selectedColumns.indexOf('mobile_payouts'), 1);
                        selectedColumns.splice(selectedColumns.indexOf('mobile_ui'), 1);
                        selectedColumns.splice(selectedColumns.indexOf('mobile_analytics'), 1);
                        selectedColumns.push('mobile');
                    }
                }
            }

            if (selectedColumns.length > 0) {
                output += `${internalName}:${selectedColumns.join(':')},`;
            }
        }
    });

    // Remove the trailing comma and update the textbox
    outputText.value = output.slice(0, -1);
}

// Function to copy the text to clipboard
function copyText() {
    const outputText = document.getElementById('output-text');
    outputText.select();
    document.execCommand('copy');
}

// Initial table update
updateTable();