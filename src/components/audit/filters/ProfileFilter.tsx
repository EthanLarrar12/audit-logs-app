import React, { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { FilterGroup } from './FilterGroup';
import { styles } from './ProfileFilter.styles';

interface Profile {
    id: string;
    name: string;
}

interface ProfileFilterProps {
    label: string;
    value: string | null;
    profiles: Profile[];
    onChange: (id: string | null) => void;
}

export const ProfileFilter: React.FC<ProfileFilterProps> = ({ label, value, profiles, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        if (!isOpen) setSearchText('');
    }, [isOpen]);

    const filteredProfiles = profiles.filter((p) => p.name.includes(searchText));

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchText(e.target.value);
    };

    const handleClearSelection = (): void => {
        onChange(null);
        setIsOpen(false);
    };

    const handleProfileSelect = (id: string): void => {
        onChange(id);
        setIsOpen(false);
    };

    return (
        <FilterGroup label={label}>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        dir="rtl"
                        className={styles.trigger}
                    >
                        <div className={styles.triggerWrapper}>
                            <span className={cn("truncate", !value && styles.placeholder)}>
                                {value
                                    ? profiles.find((p) => p.id === value)?.name
                                    : "בחר פרופיל..."}
                            </span>
                        </div>
                        <ChevronsUpDown className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className={styles.searchableDropdownContent} align="end">
                    <div className={styles.searchableDropdownSearch} dir="rtl">
                        <Search className="h-4 w-4 opacity-50" />
                        <input
                            placeholder="חיפוש פרופיל..."
                            className={styles.searchableDropdownSearchInput}
                            value={searchText}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className={styles.searchableDropdownList} dir="rtl">
                        <div
                            className={cn(
                                styles.searchableDropdownItem,
                                !value && styles.searchableDropdownItemSelected
                            )}
                            onClick={handleClearSelection}
                        >
                            <span>כל הפרופילים</span>
                            {!value && <Check className="h-4 w-4" />}
                        </div>
                        {filteredProfiles.map((profile) => (
                            <div
                                key={profile.id}
                                className={cn(
                                    styles.searchableDropdownItem,
                                    value === profile.id && styles.searchableDropdownItemSelected
                                )}
                                onClick={() => handleProfileSelect(profile.id)}
                            >
                                <span>{profile.name}</span>
                                {value === profile.id && <Check className="h-4 w-4" />}
                            </div>
                        ))}
                        {filteredProfiles.length === 0 && (
                            <div className={styles.searchableDropdownNoResults}>
                                לא נמצאו תוצאות
                            </div>
                        )}
                    </div>
                </PopoverContent>
            </Popover>
        </FilterGroup>
    );
}
