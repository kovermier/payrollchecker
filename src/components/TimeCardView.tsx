import React, { useReducer, useState, useRef } from 'react';
import { format, parseISO } from 'date-fns';
import Papa from 'papaparse';
import _ from 'lodash';
import { Combobox, ComboboxInput } from '@headlessui/react'
import { v4 as uuidv4 } from 'uuid';

interface TimeEntry {
  Time: string;
  Agent: string;
  'Aux Reason': string | null;
  'Wm Name': string;
  DurationMin: number;
}

type State = {
  entries: { [key: string]: { [key: string]: TimeEntry[] } }; // agent -> date -> entries
  agents: string[];
};

type SetEntriesAction = {
  type: 'SET_ENTRIES';
  payload: {
    entries: State['entries'];
    agents: string[];
  };
};

type Action = SetEntriesAction;

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_ENTRIES':
      return { 
        ...state,
        entries: action.payload.entries,
        agents: action.payload.agents
      };
    default:
      return state;
  }
}

const TimecardView: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, { entries: {}, agents: [] });
  const [error, setError] = useState<string>('');
  const [csvInput, setCsvInput] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null); 
  const inputRef = useRef<HTMLInputElement>(null);

  const processCSV = (csvText: string) => {
    try {
      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => header.trim(),
        complete: (results: Papa.ParseResult<TimeEntry>) => {
          const validEntries = results.data.filter((entry: Partial<TimeEntry>) => 
            entry && entry.Time && typeof entry.Time === 'string' && entry.Time.trim() !== ''
          );
          groupDataByAgentAndDate(validEntries as TimeEntry[]);
        },
        error: (error: Papa.ParseError) => {
          setError(`Parse error: ${error}`);
        }
      });
    } catch (e) {
      setError(`Error processing data: ${e}`);
    }
  };

  const groupDataByAgentAndDate = (entries: TimeEntry[]) => {
    try {
      // First group by agent
      const groupedByAgent = _.groupBy(entries, 'Agent');
      
      // Then for each agent, group their entries by date
      const fullyGrouped = _.mapValues(groupedByAgent, (agentEntries) => {
        return _.groupBy(agentEntries, (entry) => {
          if (!entry?.Time) return 'unknown';
          return format(parseISO(entry.Time), 'yyyy-MM-dd');
        });
      });

      const agents = Object.keys(groupedByAgent).filter(Boolean);
      
      dispatch({ 
        type: 'SET_ENTRIES', 
        payload: { 
          entries: fullyGrouped,
          agents
        }
      });
    } catch (e) {
      setError(`Error grouping data: ${e}`);
    }
  };

  const getScheduleForDay = (entries: TimeEntry[]) => {
    const logons = entries.filter(e => e['Wm Name'] === 'LOGON');
    const logoffs = entries.filter(e => e['Wm Name'] === 'LOGOFF');
    
    if (logons.length && logoffs.length) {
      const firstLogon = format(parseISO(logons[0].Time), 'h:mm a');
      const lastLogoff = format(parseISO(logoffs[logoffs.length - 1].Time), 'h:mm a');
      return `${firstLogon} - ${lastLogoff}`;
    }
    return '';
  };

  const renderTimeEntry = (entry: TimeEntry, index: number) => {
    const time = format(parseISO(entry.Time), 'h:mm a');
    
    let icon = null;
    if (entry['Wm Name'] === 'LOGON') {
      icon = <span className="text-yellow-400">⚡</span>;
    } else if (entry['Wm Name'] === 'LOGOFF') {
      icon = <span className="text-gray-400">⭘</span>;
    } else if (entry['Wm Name'] === 'AUX') {
      icon = <span className="text-blue-400">🔄</span>;
    }

    // Create a unique key by combining timestamp with index and event type
    const uniqueKey = `${entry.Time}-${index}-${entry['Wm Name']}`;

    return (
      <div key={uniqueKey} className="flex items-center gap-2 text-sm text-gray-400">
        <span className="w-24 font-mono">{time}</span>
        {icon}
        <span>{entry['Wm Name']}</span>
        {entry.DurationMin > 0 && 
          <span className="text-gray-400">({entry.DurationMin.toFixed(2)} min)</span>
        }
      </div>
    );
  };

  const renderAgentEntries = (agentEntries: { [key: string]: TimeEntry[] }) => {
    // Sort dates in descending order
    const sortedDates = Object.entries(agentEntries)
      .sort(([dateA], [dateB]) => {
        if (dateA === 'unknown') return 1;
        if (dateB === 'unknown') return -1;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });

    return (
      <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-900">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr className="border-b border-gray-700">
              <th className="p-3 text-left text-white font-semibold w-32">Date</th>
              <th className="p-3 text-left text-white font-semibold w-48">Schedule</th>
              <th className="p-3 text-left text-white font-semibold">Activities</th>
            </tr>
          </thead>
          <tbody>
            {sortedDates.map(([date, entries]) => ( 
              <tr key={`${date}-${uuidv4()}`} className="border-t border-gray-700"> 
                <td className="p-3 text-gray-400 font-medium">
                  {date !== 'unknown' ? format(parseISO(date), 'EEE MM/dd') : 'Unknown'}
                </td>
                <td className="p-3 text-gray-400 font-mono text-sm">
                  {getScheduleForDay(entries)}
                </td>
                <td className="p-3">
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {entries.map((entry, index) => renderTimeEntry(entry, index))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-4 bg-gray-900 min-h-screen">
      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <div className="mb-6">
        <textarea
          value={csvInput}
          onChange={(e) => setCsvInput(e.target.value)}
          className="w-full h-48 bg-gray-800 border border-gray-700 p-3 rounded font-mono text-sm text-gray-200 placeholder-gray-500"
          placeholder="Paste CSV data here..."
        />
        <button
          onClick={() => processCSV(csvInput)}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Process CSV
        </button>
      </div>

      {state.agents.length > 0 && (
        <div className="mb-4">
          <Combobox value={selectedAgent} onChange={(e) => setSelectedAgent(e)}>
            <ComboboxInput className="w-full border border-gray-700 bg-gray-800 text-gray-200 p-2 rounded" placeholder="Select Agent" ref={inputRef}/>
            <Combobox.Options className="absolute mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
              {state.agents.map((agent) => (
                <Combobox.Option key={agent} value={agent}>
                  {agent}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </Combobox>
        </div>
      )}
      {selectedAgent && state.entries[selectedAgent] && (
        renderAgentEntries(state.entries[selectedAgent])
      )}
    </div>
  );
};

export default TimecardView;
