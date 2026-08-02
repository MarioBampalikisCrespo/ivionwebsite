package com.ivion.main.service.impl;

import com.ivion.main.dto.ColourDTO;
import com.ivion.main.repository.ColourRepository;
import com.ivion.main.service.ColourService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ColourServiceImpl implements ColourService {

    private final ColourRepository colourRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ColourDTO> findAll() {
        return colourRepository.findAll().stream()
                .map(ColourDTO::from)
                .collect(Collectors.toList());
    }
}
